import { ref, computed } from 'vue';
import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', () => {
    const min = ref(11)
    const max = ref(92)

    const init = (mn: number, mx: number) => {
        min.value = mn
        max.value = mx
    }
    const isValid = computed(() => {
        return min.value < max.value;
    })

    const outputLanguage = ref()
    const inputLanguage = ref({ flag: '🇬🇧', description: 'English (Great Britain)', code: 'en-GB' },)
    const silentMode = ref(false)

    return { init, isValid, silentMode, outputLanguage, inputLanguage, min, max }
})