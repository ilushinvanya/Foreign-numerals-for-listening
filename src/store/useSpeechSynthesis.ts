import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useSettings } from "./useSettings";

export const useSpeechSynthesis = defineStore('speechSynthesis', () => {
	const settingsStore = useSettings()
	const { outputLanguage } = storeToRefs(settingsStore)

	const isInit = ref(false)
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
			isInit.value = true;
		};

		utterance.onend = () => {
			isSpeaking.value = false;
		};

		speechSynthesis.speak(utterance);
	}

	const shutUp = () => {
		if ('speechSynthesis' in window) {
			do {
				window.speechSynthesis.cancel();
			} while (window.speechSynthesis.pending);
		}
	}

	return {
		isSpeaking,
		isSynthesisInit: isInit,
		synthesisError: error,
		speak,
		shutUp
	}
});