class Example {
	min = 0;
	max = 0;
	a = 0;
	b = 0;
	c = 0;
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}
	getRandomInt() {
		const min = Math.ceil(this.min);
		const max = Math.floor(this.max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	generate() {
		this.a = this.getRandomInt();
		this.b = this.getRandomInt();
		this.c = this.a + this.b;
	}
	check(answer) {
		const check = this.c === parseInt(answer);
		if(check) return check;
		return this.c;
	}
}
let example;

class Synth {
	voice = null
	doesntSupport = false
	textToSpeak = ''
	constructor() {
		if (!speechSynthesis || !speechSynthesis?.getVoices) {
			this.doesntSupport = true
			speechSynthesis.getVoices = () => []
		}
		let voices = speechSynthesis.getVoices()
		if (speechSynthesis.onvoiceschanged !== undefined) {
			speechSynthesis.onvoiceschanged = function () {
				voices = window.speechSynthesis.getVoices()
				setEnglishVoice()
			}
		}
		const setEnglishVoice = () => {
			voices.some(voice => {
				// if (vice.default) {
				if (voice.lang.includes('en')) {
					console.log('en vice', voice)
					this.voice = voice
					return true
				}
				return false
			});
		}
		setEnglishVoice();
	}
	speak(text) {
		this.textToSpeak = text;
		if(this.doesntSupport) return;
		const utterance = new SpeechSynthesisUtterance(this.textToSpeak)
		console.log('speak utterance', this)
		utterance.voice = this.voice
		// utterance.volume = this.volume
		// utterance.pitch = this.pitch
		// utterance.rate = Math.pow(Math.abs(this.rate) + 1, this.rate < 0 ? -1 : 1)
		debugger;
		speechSynthesis.speak(utterance)
	}
	repeat() {
		this.speak(this.textToSpeak);
	}
}
const synth = new Synth()

class IO {
	recognition() {
		const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		let recognition;
		if(!speechRecognition) return;
		recognition = new speechRecognition;
		recognition.lang = 'ru-RU';
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		let recognitionTextResult = '';
		recognition.onresult = (event) => {
			const last = event.results.length - 1;
			recognitionTextResult = 'Результат: ' + event.results[last][0].transcript;
			console.log(recognitionTextResult)
		};
		recognition.onspeechend = () => {
			recognition.stop();
		};
		recognition.onerror = (event) => {
			console.log(`Error occurred in recognition: `, event);
		};
		// recognition.start();
		// recognition.stop();
	}
	answer(data) {
		// convert from number
		const ex = `${data.a} + ${data.b}`;
		if(showNumbers) {
			document.getElementById('example').innerText = ex;
		}
	}
	result(checked) {
		document.getElementById('check').innerText = checked === true ? '🟢' : '🔴 ' + checked
	}
}
let io;

let showText = false;
let showNumbers = false;

function init() {
	document.getElementById('game').classList.remove('hide');
	document.getElementById('check').innerText = 'Check'
	document.getElementById('example').innerText = ''
	document.getElementById('input').value = ''
	document.getElementById('input').focus()
	showNumbers = false

	const min = document.getElementById('min').value
	const max = document.getElementById('max').value
	example = new Example(min,max)
	example.generate()
	const { a, b } = example;

	io = new IO()
	io.answer({ a, b })
	synth.speak(`${a} + ${b}`)
}

function onHandleSubmitInput() {
	const value = document.getElementById('input').value
	const checked = example.check(value)
	io.result(checked)

}

function onHandleShowNumber() {
	showNumbers = true;
	const { a, b } = example;
	io.answer({ a, b })
}
