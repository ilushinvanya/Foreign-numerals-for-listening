import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useSettings } from "./useSettings";

export const useSpeechRecognition = defineStore('speechRecognition', () => {
	const settingsStore = useSettings()
	const { inputLanguage } = storeToRefs(settingsStore)

	const transcript = ref('')
	const error = ref<string | null>(null)
	const isListening = ref(false)

	if (!('webkitSpeechRecognition' in window)) {
		error.value = 'Speech recognition is not supported in this browser.';
	}
	// @ts-ignore
	const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new speechRecognition();

	recognition.onstart = () => {
		isListening.value = true;
	};

	recognition.onerror = (event:any) => {
		error.value = 'Error occurred in recognition: ' + event.error;
		console.error(error.value);
	};

	recognition.onend = () => {
		isListening.value = false;
	};

	const start = () => {
		transcript.value = ''
		recognition.lang = inputLanguage.value?.code || 'en-US';

		let finalResult = '';
		recognition.onresult = (event:any) => {
			let finalTranscript = '';
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript;
				}
			}
			finalResult += finalTranscript;
			transcript.value = finalResult;
			error.value = null;
		}

		recognition.start();
	}

	const stop = () => {
		recognition.stop();
	}

	const toggleMic = () => {
		if(isListening.value) {
			stop()
		}
		else {
			start()
		}
	}

	return {
		isListening,
		transcript,
		recognitionError: error,
		start,
		stop,
		toggleMic
	}

});