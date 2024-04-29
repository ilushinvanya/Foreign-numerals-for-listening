import {defineStore, storeToRefs} from 'pinia';
import { ref } from 'vue';
import { useSettings } from "./settings";

export const useSpeechRecognitionStore = defineStore('speechRecognition', () => {
	const settings = useSettings()
	const { inputLanguage } = storeToRefs(settings)

	const transcript = ref('')
	const error = ref<string | null>(null)
	const isListening = ref(false)

	const start = () => {
		if (!('webkitSpeechRecognition' in window)) {
			error.value = 'Speech recognition is not supported in this browser.';
			return;
		}
		// @ts-ignore
		const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new speechRecognition();

		let interimResult = '';
		let finalResult = '';

		recognition.interimResults = true;
		recognition.lang = inputLanguage.value?.code || 'en-US';

		recognition.onstart = () => {
			isListening.value = true;
			console.log('Speech recognition service has started');
		};

		recognition.onresult = (event:any) => {
			let interimTranscript = '';
			let finalTranscript = '';

			for (let i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					finalTranscript += event.results[i][0].transcript;
				} else {
					interimTranscript += event.results[i][0].transcript;
				}
			}

			interimResult = interimTranscript;
			finalResult += finalTranscript;

			transcript.value = finalResult;
			error.value = null;
		}

		recognition.onerror = (event:any) => {
			error.value = 'Error occurred in recognition: ' + event.error;
			console.error(error.value);
		};

		recognition.onend = () => {
			isListening.value = false;
			console.log('Speech recognition service has ended');
		};

		recognition.start();
	}

	return {
		transcript, error, isListening, start
	}

});