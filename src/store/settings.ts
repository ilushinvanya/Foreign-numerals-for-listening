import { ref, computed } from 'vue';
import { defineStore } from 'pinia'
import { LANGUAGES } from './artyom';

export const useSettings = defineStore('settings', () => {
    const min = ref(11)
    const max = ref(99)

    const init = (mn: number, mx: number) => {
        min.value = mn
        max.value = mx
    }
    const isValid = computed(() => {
        return min.value < max.value;
    })

    const getDefaultLanguage = (code: string) => {
        return LANGUAGES.find(lang => lang.code === code)
    }

    const outputLanguage = ref(getDefaultLanguage('en-GB'))
    const inputLanguage = ref(getDefaultLanguage('ru-RU'))

    const silentMode = ref(false)

    return { init, isValid, silentMode, outputLanguage, inputLanguage, min, max }
})