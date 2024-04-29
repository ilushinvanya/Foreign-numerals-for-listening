import {defineStore, storeToRefs} from 'pinia';
import { ref } from 'vue';
import { useSettings } from "./settings";

export const useSpeechSynthesisStore = defineStore('speechSynthesis', () => {
	const settings = useSettings()
	const { outputLanguage } = storeToRefs(settings)

	const isSpeaking = ref(false)
	const error = ref<string | null>(null)

	const speak = (text: string) => {
		if (!('speechSynthesis' in window)) {
			isSpeaking.value = false;
			error.value = 'Speech Synthesis is not supported in this browser.';
			return;
		}

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = outputLanguage.value?.code || 'en-US';

		utterance.onstart = () => {
			isSpeaking.value = true;
			console.log('Speech synthesis service has started');
		};

		utterance.onend = () => {
			isSpeaking.value = false;
			console.log('Speech synthesis service has ended');
		};

		speechSynthesis.speak(utterance);
	}

	return {
		isSpeaking,
		synthError: error,
		speak
	}
});