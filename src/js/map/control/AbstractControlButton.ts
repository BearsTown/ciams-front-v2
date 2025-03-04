import {
  ButtonType,
  ConstructorParams,
  IControlButton,
  ListenerArray,
  ListenerKey,
} from '@/js/map/control/IControlButton'
import { MapControlType } from '@/enums/mapEnum'
import { InteractionType } from '@/js/map/interaction/InteractionManager'

export type ControlButton = {
  button: AbstractControlButton
  closeIgnores?: MapControlType[]
  listeners: { key: ListenerKey; fn: (value: { id: MapControlType; state?: boolean }) => void }[]
}

export abstract class AbstractControlButton implements IControlButton {
  id: MapControlType
  title: string
  iconName: string
  iconSize?: number
  type?: ButtonType
  isOpen?: boolean
  isActive?: boolean
  isVisible?: boolean
  isKeepAlive?: boolean
  interaction?: InteractionType

  listeners: ListenerArray = {
    click: [],
    open: [],
    active: [],
    visible: [],
  }

  protected constructor({
    id = 'drag-pan',
    title = '',
    iconName = '',
    iconSize = 22,
    isOpen = false,
    isActive = false,
    isVisible = true,
    isKeepAlive = false,
    interaction = undefined,
  }: ConstructorParams) {
    this.id = id
    this.title = title
    this.iconName = iconName
    this.iconSize = iconSize
    this.isOpen = isOpen
    this.isActive = isActive
    this.isVisible = isVisible
    this.isKeepAlive = isKeepAlive
    this.interaction = interaction
  }

  abstract click(): void

  setActive(active: boolean): void {
    if (this.hasStateChanged(this.isActive!, active)) {
      return
    }
    this.isActive = active
    this.activeExecute()
  }

  setVisible(visible: boolean): void {
    if (this.hasStateChanged(this.isVisible!, visible)) {
      return
    }
    this.isVisible = visible
    this.visibleExecute()
  }

  protected toggleActive(): void {
    this.isActive = !this.isActive
    this.activeExecute()
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible
    this.visibleExecute()
  }

  onEventListener(
    key: ListenerKey,
    handler: (value: { id: MapControlType; state?: boolean }) => void,
  ): void {
    // this.listeners[key] = handler.bind(this)
    this.listeners[key].push(handler.bind(this))
  }

  activeExecute(): void {
    this.executeListener('active', {
      id: this.id,
      value: this.isActive,
    })
  }

  visibleExecute(): void {
    this.executeListener('visible', {
      id: this.id,
      value: this.isVisible,
    })
  }

  setOpen(open: boolean): void {
    if (this.hasStateChanged(this.isOpen!, open)) {
      return
    }
    this.isOpen = open
    this.openExecute()
  }

  openExecute(): void {
    this.executeListener('open', {
      id: this.id,
      value: this.isOpen,
    })
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen
    this.openExecute()
  }

  protected clickExecute(): void {
    this.executeListener('click', {
      id: this.id,
    })
  }

  protected hasStateChanged(currentState: boolean, newState: boolean): boolean {
    return currentState === newState
  }

  protected executeListener(
    key: ListenerKey,
    value: { id: MapControlType; value?: boolean },
  ): void {
    this.listeners[key].forEach((listener) =>
      listener({
        id: value.id,
        state: value.value,
      }),
    )
  }
}
