import { v4 as uuidV4 } from 'uuid'
import UitDefaultLayer from '@uitgis/ol-ugis-test/layer/uitDefaultLayer'

interface State {
  visible: boolean
  useLegend: boolean
  useLayerSetting: boolean
}

interface IMapLayer {
  layer: UitDefaultLayer | undefined
  title?: string
  userVisible?: boolean
  useLegend?: boolean
  useLayerSetting?: boolean
}

type RequiredOnly = Pick<IMapLayer, 'layer'>
type ConstructorParams = RequiredOnly & Partial<Omit<IMapLayer, 'layer'>>

export class MapLayer {
  private layer?: UitDefaultLayer

  title: string
  private key: string

  state: State

  private viewVisible: boolean
  userVisible: boolean

  // useLegend?: boolean
  // useLayerSetting?: boolean

  visible: { value: boolean }

  constructor({
    layer = undefined,
    title = '',
    userVisible = false,
    useLegend = false,
    useLayerSetting = false,
  }: ConstructorParams) {
    this.layer = layer
    this.title = title
    this.key = uuidV4()

    this.viewVisible = true
    this.userVisible = userVisible

    this.state = {
      visible: false,
      useLegend: useLegend,
      useLayerSetting: useLayerSetting,
    }

    const emitter = new EventEmitter()

    this.visible = new Proxy<{ value: boolean }>(
      { value: this.state.visible },
      {
        get: (target, prop) => {
          if (prop === 'value') {
            return target.value
          }
          return Reflect.get(target, prop)
        },
        set: (target, prop, value) => {
          if (prop === 'value') {
            this.state.visible = !!value
            this.layer?.setVisible(this.state.visible)

            emitter.emit('change:visible', {
              layer: this.layer,
              visible: this.state.visible,
            })

            return true
          }
          return Reflect.set(target, prop, value)
        },
      },
    )

    this.visible.on = (eventName, callback) => emitter.on(eventName, callback)

    this._setVisible()
  }

  getKey(): string {
    return this.key
  }

  getLayer(): UitDefaultLayer {
    return this.layer!
  }

  isVisible(): boolean {
    return this.visible.value
  }

  getViewVisible(): boolean {
    return this.viewVisible
  }

  setViewVisible(visible: boolean): void {
    this.viewVisible = visible != null && visible
    this._setVisible()
  }

  getUserVisible(): boolean {
    return this.userVisible
  }

  setUserVisible(visible: boolean): void {
    this.userVisible = visible != null && visible
    this._setVisible()
  }

  private _setVisible(): void {
    this.visible.value = this.viewVisible && this.userVisible
  }
}

// 이벤트 리스너를 관리하는 헬퍼 클래스
class EventEmitter {
  private listeners: Map<string, any>

  constructor() {
    this.listeners = new Map()
  }

  // 이벤트 리스너 등록
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, [])
    }
    this.listeners.get(eventName).push(callback)
  }

  // 이벤트 발생 시 리스너 호출
  emit(eventName, ...args) {
    const callbacks = this.listeners.get(eventName) || []
    callbacks.forEach((callback) => callback(...args))
  }
}
