import { AbstractControlButton } from '@/js/map/control/AbstractControlButton'
import { MapControlType } from '@/enums/mapEnum'
import { GroupButton } from '@/js/map/control/GroupButton'
import { TriggerButton } from '@/js/map/control/TriggerButton'
import { ToggleButton } from '@/js/map/control/ToggleButton'

export type ControlType = {
  button: AbstractControlButton
  closeIgnores?: MapControlType[]
}

type ControlsType = Map<MapControlType, ControlType>

type IControlManager = {
  controls?: ControlsType
}

export class ControlManager {
  private controls: ControlsType

  constructor({ controls = new Map() }: IControlManager) {
    this.controls = controls
  }

  getControl(id: MapControlType, group?: boolean): AbstractControlButton | undefined {
    for (const [key, value] of this.controls.entries()) {
      if (value.button instanceof GroupButton && value.button.children && !group) {
        const foundChild = value.button.children.find((child) => child.button.id === id)
        if (foundChild) {
          return foundChild.button
        }
      } else {
        if (value.button.id === id) {
          return value.button
        }
      }
    }
  }

  addControl(id: MapControlType, control: ControlType): void {
    this.controls.set(id, control)
    this._addCloseEventListener(control)
    this._addActiveEventListener(control)
  }

  closeAll(id?: MapControlType): void {
    const excludeKeys = id
      ? new Set([id, ...(this.controls.get(id)?.closeIgnores || [])])
      : new Set()

    this.controls.forEach((control: ControlType, key: MapControlType) => {
      const btn = control.button
      if (!excludeKeys.has(key)) {
        if (btn.type === 'group') {
          btn.setOpen(false)
        } else if (btn.type === 'toggle') {
          if (!btn.interaction) {
            btn.setActive(false)
          }
        }
      }
    })
  }

  deActiveAll(id?: MapControlType): void {
    const excludeKeys = id ? new Set([id]) : new Set()

    if (id) {
      // excludeKeys.add(this._findGroupWithButtonId(id))
    }

    this.controls.forEach((control: ControlType, key: MapControlType) => {
      const btn = control.button
      if (!excludeKeys.has(key)) {
        if (btn instanceof GroupButton) {
          btn.setActive(false)
          btn.children.forEach((cBtn, index) => {
            if (cBtn.button.type === 'trigger' || cBtn.button.type === 'toggle') {
              if (cBtn.button.interaction) {
                cBtn.button.setActive(false)
                btn.reset()
              }
            }
          })
        } else if (btn instanceof TriggerButton || btn instanceof ToggleButton) {
          if (btn.interaction) {
            btn.setActive(false)
          }
        }
      }
    })
  }

  private _addCloseEventListener(control: ControlType): void {
    const btn = control.button
    const closeEvent = (value: { id: MapControlType; state?: boolean }): void => {
      if (value.state) {
        this.closeAll(btn.id)
      }
    }

    if (btn.type === 'group') {
      btn.onEventListener('open', closeEvent)
    } else if (btn.type === 'toggle' && !btn.interaction) {
      btn.onEventListener('active', closeEvent)
    }
  }

  private _addActiveEventListener(control: ControlType): void {
    const pBtn = control.button

    if (pBtn instanceof GroupButton) {
      pBtn.children.forEach((cBtn, index) => {
        if (cBtn.button.type === 'toggle') {
          cBtn.button.onEventListener(
            'active',
            (value: { id: MapControlType; state?: boolean }): void => {
              if (cBtn.button.interaction) {
                cBtn.button.interaction.getInteraction!()?.setActive(!!value.state)
              }
              if (value.state) {
                this.deActiveAll(pBtn.id)
                pBtn.setCurrentItem(cBtn.button)
              } else {
                pBtn.reset()
              }
            },
          )
        }

        const interaction = cBtn.button.interaction
        if (interaction && interaction.getInteraction) {
          interaction.getInteraction()?.on('change:active', (event) => {
            cBtn.button.setActive(event.target.getActive())
          })
        }
      })
    } else if (pBtn instanceof ToggleButton) {
      const interaction = pBtn.interaction
      if (interaction) {
        pBtn.onEventListener('active', (value: { id: MapControlType; state?: boolean }): void => {
          if (value.state) {
            this.deActiveAll(pBtn.id)
          }
          interaction.getInteraction!()?.setActive(!!value.state)
        })
        if (interaction.getInteraction) {
          interaction.getInteraction()?.on('change:active', (event) => {
            pBtn.setActive(event.target.getActive())
          })
        }
      }
    }
  }

  private _findGroupWithButtonId(id: MapControlType): MapControlType | null {
    for (const [key, value] of this.controls.entries()) {
      if (value.button instanceof GroupButton && value.button.children) {
        const foundChild = value.button.children.find(
          (child) => child.button.id === id && child.button.isActive,
        )
        if (foundChild) {
          return value.button.id
        }
      }
    }
    return null
  }
}
