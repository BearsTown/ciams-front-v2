import { ConstructorParams } from '@/js/map/control/IControlButton'

import { AbstractControlButton } from '@/js/map/control/AbstractControlButton'

export class TriggerButton extends AbstractControlButton {
  constructor(params: ConstructorParams) {
    super(params)

    this.type = 'trigger'
  }

  click(): void {
    this.clickExecute()
  }
}
