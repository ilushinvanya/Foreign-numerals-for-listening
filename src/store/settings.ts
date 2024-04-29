import { ref, computed } from 'vue';
import { defineStore } from 'pinia'


export interface ILanguage {
    flag: string;
    description: string;
    code: string;
}

export const LANGUAGES: ILanguage[] = [
    { flag: '🇺🇸', description: 'English (USA)', code: 'en-US' },
    { flag: '🇬🇧', description: 'English (Great Britain)', code: 'en-GB' },
    { flag: '🇪🇸', description: 'Español', code: 'es-ES' },
    { flag: '🇩🇪', description: 'Deutsch', code: 'de-DE' },
    { flag: '🇮🇹', description: 'Italiano', code: 'it-IT' },
    { flag: '🇫🇷', description: 'Français', code: 'fr-FR' },
    { flag: '🇷🇺', description: 'Russian', code: 'ru-RU' },
    { flag: '🇧🇷', description: 'Brazil', code: 'pt-PT' },
    { flag: '🇵🇱', description: 'Polski (Poland)', code: 'pl-PL' },
    { flag: '🇮🇩', description: 'Indonesian (Indonesia)', code: 'id-ID' },
    { flag: '🇳🇱', description: 'Dutch (netherlands)', code: 'nl-NL' },
    { flag: '🇨🇳', description: 'Chinese (Cantonese[ 粤語（香港）]', code: 'zh-HK' },
    { flag: '🇨🇳', description: 'Mandarin[普通话（中国大陆）])', code: 'zh-CN' },
    { flag: '🇮🇳', description: 'Hindi (India Google हिन्दी)', code: 'hi-IN' },
];

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