import { reactive, readonly } from 'vue'
import { ListenerKey } from '@/js/map/control/IControlButton'
import { AbstractControlButton } from '@/js/map/control/AbstractControlButton'
import { ToggleButton } from '@/js/map/control/ToggleButton'
import { TriggerButton } from '@/js/map/control/TriggerButton'
import { GroupButton } from '@/js/map/control/GroupButton'

type useControlState = {
  isOpen: boolean
  isActive: boolean
  isVisible: boolean
}

export type useControl = {
  state: useControlState
  handleClick: () => void
  on: (key: Exclude<ListenerKey, 'click'>) => void
  off: (key: Exclude<ListenerKey, 'click'>) => void
}

export function useControl(obj: AbstractControlButton): useControl {
  const state: useControlState = reactive({
    isOpen: !!obj.isOpen,
    isActive: !!obj.isActive,
    isVisible: !!obj.isVisible,
  })

  const readOnlyState: Readonly<useControlState> = readonly(state)

  function handleClick() {
    obj.click()

    state.isOpen = !!obj.isOpen
    state.isActive = !!obj.isActive

    // if (obj instanceof ToggleButton) {
    //   state.isActive = !!obj.active
    // } else if (obj instanceof GroupButton) {
    //   state.isActive = !!obj.active
    // }
  }

  function on(key: Exclude<ListenerKey, 'click'>) {
    _onOff(key, true)
  }

  function off(key: Exclude<ListenerKey, 'click'>) {
    _onOff(key, false)
  }

  function _onOff(key: Exclude<ListenerKey, 'click'>, bool: boolean) {
    switch (key) {
      case 'active': {
        if (obj instanceof ToggleButton) {
          obj.setActive(bool)
          state.isActive = bool
        } else if (obj instanceof TriggerButton) {
          //
        }
        break
      }
      case 'visible': {
        obj.setVisible(bool)
        state.isVisible = bool
        break
      }
      case 'open': {
        if (obj instanceof GroupButton) {
          obj.setOpen(bool)
          state.isOpen = bool
        }
        break
      }
    }
  }

  return {
    state: readOnlyState,
    on,
    off,
    handleClick,
  }
}
