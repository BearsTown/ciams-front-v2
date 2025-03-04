import { MapInteractionType } from '@/enums/mapEnum'

import { default as olInteraction } from 'ol/interaction/Interaction'

import { DefaultInteraction } from '@uitgis/ol-ugis-test/interaction/uitInterfaceInteraction'
import UitDefaultInteraction from '@uitgis/ol-ugis-test/interaction/uitDefaultInteraction'

export type InteractionType =
  | DefaultInteraction<olInteraction>
  | UitDefaultInteraction<olInteraction>

type InteractionsType = Map<MapInteractionType, InteractionType>

type IInteractionManager = {
  interactions?: InteractionsType
}

export class InteractionManager {
  private interactions: InteractionsType

  constructor({ interactions = new Map() }: IInteractionManager) {
    this.interactions = interactions
  }

  getInteraction(id: MapInteractionType): InteractionType | undefined {
    return this.interactions.get(id)
  }

  addInteraction(id: MapInteractionType, interaction: InteractionType): void {
    this.interactions.set(id, interaction)
    this._addActiveEventListener(id, interaction)
  }

  deActiveAll(id?: MapInteractionType): void {
    this.interactions.forEach((interaction: InteractionType, key: MapInteractionType) => {
      if (key !== id && interaction.getActive()) interaction.setActive(false)
    })
  }

  private _addActiveEventListener(id: MapInteractionType, interaction: InteractionType): void {
    const olInteraction = interaction.getInteraction!()

    if (olInteraction) {
      olInteraction.on('change:active', (event) => {
        if (event.target.getActive()) this.deActiveAll(id)
      })
    }
  }
}
