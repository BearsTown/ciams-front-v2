import { ref, Ref } from 'vue'

export interface UseBoolean {
  status: Ref<boolean>
  on: () => boolean
  off: () => boolean
  toggle: () => boolean
}

export function useBoolean(defaultValue = true): UseBoolean {
  const status = ref(defaultValue)

  return {
    status,
    on: () => (status.value = true),
    off: () => (status.value = false),
    toggle: () => (status.value = !status.value),
  }
}
