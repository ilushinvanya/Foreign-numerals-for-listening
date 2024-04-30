import {defineStore, storeToRefs} from 'pinia';
import { ref } from 'vue';
import { useSettings } from "./settings";

export const useSpeechSynthesisStore = defineStore('speechSynthesis', () => {
	const settings = useSettings()
	const { outputLanguage } = storeToRefs(settings)

	const isSpeaking = ref(false)
	const error = ref<string | null>(null)

	if (!('speechSynthesis' in window)) {
		isSpeaking.value = false;
		error.value = 'Speech Synthesis is not supported in this browser.';
	}

	const speak = (text: string) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = outputLanguage.value?.code || 'en-US';

		utterance.onstart = () => {
			isSpeaking.value = true;
		};

		utterance.onend = () => {
			isSpeaking.value = false;
		};

		speechSynthesis.speak(utterance);
	}

	return {
		isSpeaking,
		synthesisError: error,
		speak
	}
});