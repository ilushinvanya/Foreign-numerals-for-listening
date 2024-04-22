import { ref, computed, onMounted } from 'vue';
import { defineStore } from 'pinia'
// @ts-ignore
import Artyom from 'artyom.js';

interface LanguageList {
    flag: string;
    description: string;
    code: string;
}

const LANGUAGES: LanguageList[] = [
    { flag: '🇺🇸', description: 'English (USA)', code: 'en-US' },
    { flag: '🇬🇧', description: 'English (Great Britain)', code: 'en-GB' },
    { flag: '🇪🇸', description: 'Español', code: 'es-ES' },
    { flag: '🇩🇪', description: 'Deutsch', code: 'de-DE' },
    { flag: '🇮🇹', description: 'Italiano', code: 'it-IT' },
    { flag: '🇫🇷', description: 'Français', code: 'fr-FR' },
    { flag: '🇯🇵', description: 'Japanese 日本人', code: 'ja-JP' },
    { flag: '🇷🇺', description: 'Russian', code: 'ru-RU' },
    { flag: '🇧🇷', description: 'Brazil', code: 'pt-PT' },
    { flag: '🇵🇱', description: 'Polski (Poland)', code: 'pl-PL' },
    { flag: '🇮🇩', description: 'Indonesian (Indonesia)', code: 'id-ID' },
    { flag: '🇳🇱', description: 'Dutch (netherlands)', code: 'nl-NL' },
    { flag: '🇨🇳', description: 'Chinese (Cantonese[ 粤語（香港）]', code: 'zh-HK' },
    { flag: '🇨🇳', description: 'Mandarin[普通话（中国大陆）])', code: 'zh-CN' },
    { flag: '🇮🇳', description: 'Hindi (India Google हिन्दी)', code: 'hi-IN' },
];

export const useArtyom = defineStore('artyom', () => {

    const availableLanguages = ref<LanguageList[]>([])
    const filterLanguages = (voices:SpeechSynthesisVoice[]) => {
        return LANGUAGES.filter(language => {
            const found = voices.find(voice => {
                return language.code === voice.lang;
            });
            return !!found;
        });
    };

    const artyom = new Artyom();

    const init = () => {
        artyom.initialize({
            // debug: true,
            // lang: lang,
            // listen: true,
            // continuous: true,
            speed: 1,
        }).then(() => {
            artyom.say(' ')
        });
    }

    const initVoices = () => {
        const voices = artyom.getVoices()
        availableLanguages.value = filterLanguages(voices)
    }

    const say = (text:string, options:SayCallbacksObject) => {
        artyom.say(text, options)
    }

    const isSupported = () => {
        return artyom.speechSupported()
    }

    const detectDevice = () => {
        if(artyom.Device.isChrome) {
            if (artyom.Device.isMobile) {
                return 'isMobile';
            }
            return true;
        }
        return false;
    };

    return { artyom, init, say, availableLanguages, initVoices, detectDevice, isSupported }
})