import { ConstructorParams } from '@/js/map/control/IControlButton'

import { AbstractControlButton } from '@/js/map/control/AbstractControlButton'

export class ToggleButton extends AbstractControlButton {
  constructor(params: ConstructorParams) {
    super(params)

    this.type = 'toggle'
  }

  click(): void {
    this.clickExecute()
    this.toggleActive()
  }
}
