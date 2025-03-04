import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark({
  initialValue: 'light',
})

export const toggleDark = useToggle(isDark)
