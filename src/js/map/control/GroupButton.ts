import { ConstructorParams, IControlButton, ListenerKey } from '@/js/map/control/IControlButton'

import { AbstractControlButton } from '@/js/map/control/AbstractControlButton'
import { TriggerButton } from '@/js/map/control/TriggerButton'
import { ToggleButton } from '@/js/map/control/ToggleButton'

type RequiredOnly = Pick<IControlGroup, 'children'>
type ConstructorParams2 = ConstructorParams & RequiredOnly

interface IControlGroup extends IControlButton {
  children: {
    button: TriggerButton | ToggleButton
    listeners: { key: ListenerKey; fn: (state?: any) => void }[]
  }[]
}

export class GroupButton extends AbstractControlButton {
  originTitle: string
  originIconName: string
  originIconSize?: number

  // buttons: TriggerButton[] | ToggleButton[]
  children: {
    button: TriggerButton | ToggleButton
    listeners: { key: ListenerKey; fn: (state?: any) => void }[]
  }[]
  currentButton: TriggerButton | ToggleButton | null

  constructor({ children, ...params }: ConstructorParams2) {
    super(params)

    this.type = 'group'
    this.children = children
    this.currentButton = null
    this.originTitle = params.title
    this.originIconName = params.iconName
    this.originIconSize = params.iconSize
  }

  click(): void {
    this.clickExecute()
    this.toggleOpen()

    if (this.isActive && this.currentButton) {
      this.reset()
    }
  }

  setCurrentItem(button: TriggerButton | ToggleButton) {
    this.currentButton = button

    this.setOpen(false)
    this.setActive(true)
    this.title = this.currentButton.title
    this.iconName = this.currentButton.iconName
    this.iconSize = this.currentButton.iconSize
  }

  reset() {
    this.setOpen(false)
    this.setActive(false)
    this.currentButton?.setActive(false)
    this.currentButton = null
    this.title = this.originTitle
    this.iconName = this.originIconName
    this.iconSize = this.originIconSize
  }
}
