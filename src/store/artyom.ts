import { ref } from 'vue';
import { Notify } from 'quasar'
import { defineStore } from 'pinia'
// @ts-ignore
import Artyom from 'artyom.js';

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

export const useArtyom = defineStore('artyom', () => {

    const artyom = new Artyom()
    artyom.when('NOT_COMMAND_MATCHED', () => {
        Notify.create({
            message: 'Incorrect'
        })
    })
    artyom.when('ERROR', (error: any) => {
        // info-blocked
        // info-denied
        // no-speech
        // aborted
        // audio-capture
        // network
        // not-allowed
        // service-not-allowed
        // bad-grammar
        // language-not-supported
        // recognition_overlap
        if(error.code === 'network') {
            alert('An error ocurred, artyom cannot work without internet connection !');
        }

        if(error.code === 'audio-capture') {
            alert('An error ocurred, artyom cannot work without a microphone');
        }

        if(error.code === 'not-allowed') {
            alert('An error ocurred, it seems the access to your microphone is denied');
        }
        // Notify.create({
        //     message: 'NOT_COMMAND_MATCHED'
        // })
        console.log('artyom when ERROR', error);
    })
    const init = async (lang: string | undefined) => {
        await artyom.initialize({
            debug: false,
            lang: lang,
            listen: true,
            continuous: true,
            speed: 1,
        })
        artyom.say(' ')
    }

    const availableLanguages = ref<ILanguage[]>([])
    const filterLanguages = (voices:SpeechSynthesisVoice[]) => {
        if(!voices || !voices.length) return LANGUAGES
        const filteredLanguages = LANGUAGES.filter(language => {
            const found = voices.find(voice => {
                return language.code === voice.lang;
            });
            return !!found;
        });
        if(!filteredLanguages.length) return LANGUAGES
        return filteredLanguages
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
            if (artyom.Device.isMobile) return 'isMobile';
            return true;
        }
        return false;
    }

    const isRecognizing = () => {
        return artyom.isRecognizing()
    }

    return {
        artyom,
        init,
        say,
        availableLanguages,
        initVoices,
        detectDevice,
        isSupported,
        isRecognizing
    }
})