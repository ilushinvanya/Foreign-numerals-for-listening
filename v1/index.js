class Example {
	minA = 0;
	minB = 0;
	maxA = 0;
	maxB = 0;
	a = 0;
	b = 0;
	c = 0;
	constructor(minA, maxA, minB, maxB) {
		this.minA = minA;
		this.maxA = maxA;
		this.minB = minB;
		this.maxB = maxB;
	}
	getRandomInt(mn, mx) {
		const min = Math.ceil(mn);
		const max = Math.floor(mx);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	generate() {
		this.a = this.getRandomInt(this.minA, this.maxA);
		this.b = this.getRandomInt(this.minB, this.maxB);
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
		utterance.voice = this.voice
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
	setExample(data) {
		const ex = `${data.a} + ${data.b}`;
		if(showNumbers) {
			document.getElementById('example').innerText = ex;
		}
	}
	setExampleText(data) {
		const ex = `${writtenNumber(data.a)} + ${writtenNumber(data.b)}`;
		if(showText) {
			document.getElementById('example').innerText = ex;
		}
	}
	setResult(checked) {
		document.getElementById('check').innerText = checked === true ? '🟢' : '🔴 ' + checked
	}
	setAllGames(count) {
		document.getElementById('all-games').innerText = count + ''
	}
	setScore(count) {
		document.getElementById('score').innerText = count + ''
	}
	setPoints(count) {
		document.getElementById('points').innerText = count + ''
	}
	reset() {
		document.getElementById('game').classList.remove('hide');
		document.getElementById('check').innerText = 'Check'
		document.getElementById('example').innerText = ''
		document.getElementById('input').value = ''
		document.getElementById('input').focus()
	}
}
let io = new IO()

class Score {
	points = 2
	getPoints() {
		io.setPoints(this.points)
		return this.points
	}
	setPoints(value) {
		this.points = value
		io.setPoints(value)
	}
	resetPoints() {
		this.setPoints(2)
	}
	getAllGames() {
		const lsAllGamesScore = localStorage.getItem('all-games-score')
		const parseScores = lsAllGamesScore ? parseInt(lsAllGamesScore) : 0
		io.setAllGames(parseScores)
		return parseScores
	}
	upAllGames() {
		const updatedCount = this.getAllGames() + 1
		localStorage.setItem('all-games-score', updatedCount)
		io.setAllGames(updatedCount)
	}
	getTotal() {
		const score = localStorage.getItem('score')
		const updated = score ? parseInt(score) : 0
		io.setScore(updated)
		return updated
	}
	setTotal(value) {
		localStorage.setItem('score', value)
		io.setScore(value)
	}
	up() {
		this.setTotal(this.getTotal() + this.points)
	}
	down() {
		this.setTotal(this.getTotal() - this.points)
	}
}
let score = new Score();
score.getAllGames()
score.getTotal()

let showText = false;
let showNumbers = false;
let hasClick = false

function init() {
	io.reset()

	score.resetPoints()
	showText = false;
	showNumbers = false
	hasClick = false

	const minA = document.getElementById('min-a').value
	const maxA = document.getElementById('max-a').value
	const minB = document.getElementById('min-b').value
	const maxB = document.getElementById('max-b').value
	example = new Example(minA, maxA, minB, maxB)
	example.generate()
	const { a, b } = example;

	io.setExample({ a, b })
	synth.speak(`${a} + ${b}`)
}

function onHandleSubmitInput() {
	if(hasClick) return
	const value = document.getElementById('input').value
	const checked = example.check(value)
	io.setResult(checked)

	// TODO После текста и считывания голоса сделать логику очков такую:
	// Ввод Голосом(2), текстом(1) или числами(0.5)
	// Вывод Голосом(2), текстом(1) или числами(0.5)
	// Пример Прослушали Голосом, ввели Число получили 4 очка
	// Пример Увидели Число, ввели Текстом получили 3 очка
	// За проигрыш, какой то минус, потому что в итоге можно ввести цифру из цифры
	// Но правильный ответ, после проигрыша надо засчитать TODO
	if(checked === true) {
		score.up()
	}
	else {
		score.down()
	}
	score.upAllGames()
	hasClick = true
	document.getElementById('run').focus()
}

function onHandleShowText() {
	showText = true;
	if(score.getPoints() > 1) {
		score.setPoints(1)
	}
	const { a, b } = example;
	io.setExampleText({ a, b })
}

function onHandleShowNumber() {
	showNumbers = true;
	score.setPoints(0.5)
	const { a, b } = example;
	io.setExample({ a, b })
}

function onHandleEnterInput(event) {
	if (event.key === 'Enter') {
		// onHandleSubmitInput()
	}
}
