type activeChangeListenerType = (active: boolean) => boolean

interface MapControlAttribute {
  iconName: string
  active?: boolean
  visible?: boolean
  buttonType: 'toggle' | 'trigger'
  activeChangeListener: activeChangeListenerType
}

export class MapControl {
  iconName: string
  active: boolean
  visible: boolean
  buttonType: 'toggle' | 'trigger'
  activeChangeListener: activeChangeListenerType

  constructor({
    iconName,
    buttonType,
    activeChangeListener,
    active = false,
    visible = true,
  }: {
    iconName: string
    buttonType: 'toggle' | 'trigger'
    activeChangeListener: activeChangeListenerType
  } & Partial<Pick<MapControl, 'active' | 'visible'>>) {
    this.active = active
    this.visible = visible
    this.iconName = iconName
    this.buttonType = buttonType
    this.activeChangeListener = activeChangeListener
  }

  setActive(state: boolean): void {
    this.active = state

    this.activeChangeListener(this.active)
  }
}
