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
            return true
          }
          return Reflect.set(target, prop, value)
        },
      },
    )

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
