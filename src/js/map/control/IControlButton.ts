import { MapControlType } from '@/enums/mapEnum'
import { InteractionType } from '@/js/map/interaction/InteractionManager'

export type listenerType = (value: { id: MapControlType; state?: boolean }) => void
export type ListenerKey = 'active' | 'visible' | 'click' | 'open'
export type ListenerArray = {
  [K in ListenerKey]: Array<listenerType>
}
export type ButtonType = 'trigger' | 'toggle' | 'group'

export type RequiredOnly = Pick<IControlButton, 'id' | 'title' | 'iconName'>
export type ConstructorParams = RequiredOnly &
  Partial<Omit<IControlButton, 'id' | 'title' | 'iconName'>>

export interface IControlButton {
  id: MapControlType
  title: string
  iconName: string
  iconSize?: number
  type?: ButtonType
  isOpen?: boolean
  isKeepOpen?: boolean
  isActive?: boolean
  isVisible?: boolean
  isKeepAlive?: boolean
  interaction?: InteractionType
}
