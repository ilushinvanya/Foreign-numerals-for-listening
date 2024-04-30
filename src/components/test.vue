<template lang="pug">
.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				div
					.text-h6 Testing
					.text-subtitle2 ⏱️️ {{ time / 10 }}
				.flex.items-center
					q-btn.q-mr-md(
						to="/"
						round
						icon="settings"
					)
					div
						div All tests: {{allTests}}
						div Score: {{score}}
			q-separator(inset)
			q-card-section.flex.justify-center
				q-btn(
					round
					:outline="isSpeaking"
					:text-color="isSpeaking ? 'primary' : ''"
					size="28px"
					@click="speechCurrent"
				) 🔉{{ outputLanguage?.flag }}
				q-btn.q-ml-md(
					round
					:outline="isListening"
					:text-color="isListening ? 'primary' : ''"
					:icon="isListening ? 'mic' : 'mic_off'"
					size="28px"
					@click="toggleMic"
				)
			q-card-section.flex
				q-input(
					v-model.number="answer"
					type="number"
					outlined
					hint="Answer"
					ref="answerInputEl"
					style="width: 100%"
					@keydown.enter="handleCheckButton"
				)
					template(v-slot:append)
						q-btn(
							no-caps
							outline
							icon="check"
							color="green"
							@click="handleCheckButton"
						) Check
			q-separator(
				v-if="sortedWrongAnswer.length"
				inset
			)
			q-card-section(v-if="sortedWrongAnswer.length")
				div
					p Mistakes
					q-chip(
						v-for="n in sortedWrongAnswer"
						clickable
						@click="onClickWrongAnswer(n[0])"
					)
						q-avatar(
							color="red"
							text-color="white"
						) {{n[1]}}
						span {{ n[0] }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSettings } from '../store/settings'
import { useSpeechRecognitionStore } from '../store/useSpeechRecognitionStore'
import { useSpeechSynthesisStore } from '../store/useSpeechSynthesisStore'
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar'

const $q = useQuasar()

// question
const digit = ref(0)
const digitText = computed(() => `${digit.value}`)

const settingsStore = useSettings()
const { min, max, outputLanguage } = storeToRefs(settingsStore)

const getRandomInt = (mn:number, mx:number): number => {
	const min = Math.ceil(mn);
	const max = Math.floor(mx);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generate = () => {
	digit.value = getRandomInt(min.value, max.value);
}


// answer
const allTests = ref(0);
const score = ref(0);

const answer = ref<number | null>();
const answerInputEl = ref();

const check = (): true | number => {
	const check = digit.value === answer.value;
	if(check) return check;
	return digit.value;
}
const numberOfIncorrectAnswers = ref(0)
const handleCheckButton = () => {
	if(check() === true) {
		$q.notify({
			type: 'positive',
			message: `Correctly «${digit.value}»`
		})
		score.value++
		numberOfIncorrectAnswers.value = 0
		allTests.value++
		runTest()
	}
	else {
		numberOfIncorrectAnswers.value++

		if (numberOfIncorrectAnswers.value < 3) {
			// неправильно, но можно повторить
			$q.notify({
				type: 'warning',
				message: `Incorrect «${answer.value}». Try again`
			})
			answer.value = null
		}
		else {
			// непрвильно, ошибка
			$q.notify({
				type: 'negative',
				message: `Wrong «${answer.value}». Correct answer is «${digit.value}»`
			})
			numberOfIncorrectAnswers.value = 0

			score.value--
			allTests.value++
			setWrongAnswer()
			setTimeout(runTest, 2000)
		}
	}
}


// Wrong answers
const wrongAnswer = ref<Map<number, number>>(new Map());
const sortedWrongAnswer = computed(() => {
	return [...wrongAnswer.value.entries()].sort((a, b) => b[1] - a[1])
})
const setWrongAnswer = () => {
	const currentWrong = wrongAnswer.value.get(digit.value)
	if(currentWrong) wrongAnswer.value.set(digit.value, currentWrong + 1)
	else wrongAnswer.value.set(digit.value, 1)
}
const onClickWrongAnswer = (number: number) => {
	answer.value = null
	digit.value = number
	speech(digitText.value)
	answerInputEl.value?.focus()
}

// Init
const runTest = () => {
	answer.value = null
	generate()
	speech(digitText.value)
	answerInputEl.value?.focus()
}
onMounted(runTest)


// Recognition & Synthesis
const speechRecognitionStore = useSpeechRecognitionStore()
const { transcript, recognitionError, isListening } = storeToRefs(speechRecognitionStore)

const speechSynthesisStore = useSpeechSynthesisStore()
const { isSpeaking, synthesisError } = storeToRefs(speechSynthesisStore)

watch(recognitionError, (newValue) => {
	if(newValue) {
		$q.notify({
			type: 'negative',
			message: `${newValue}`
		})
	}
})
watch(synthesisError, (newValue) => {
	if(newValue) {
		$q.notify({
			type: 'negative',
			message: `${newValue}`
		})
	}
})

watch(isSpeaking, (newValue, oldValue) => {
	if(oldValue && !newValue) {
		speechRecognitionStore.start()
	}
})

let timer = 0
let time = ref(0)
watch(isListening, (newValue, oldValue) => {
	if(!oldValue && newValue) {
		time.value = 0
		timer = setInterval(() => {
			time.value++
		}, 100)
	}
	if(oldValue && !newValue) {
		clearInterval(timer)
		if(!transcript.value) {
			$q.notify({
				type: 'warning',
				message: `Didn't hear. Try again`
			})
			return
		}

		const parsedTranscript = parseInt(transcript.value)
		if(isNaN(parsedTranscript)) {
			$q.notify({
				type: 'warning',
				message: `Incorrect «${transcript.value}». Try again`
			})
		} else {
			answer.value = parsedTranscript
			setTimeout(handleCheckButton, 1000)
		}
	}
})

const speech = (text: string) => {
	speechRecognitionStore.stop()
	speechSynthesisStore.speak(text)
}
const speechCurrent = () => {
	speech(digitText.value)
}

const toggleMic = () => {
	if(isListening.value) {
		speechRecognitionStore.stop()
	}
	else {
		speechRecognitionStore.start()
	}
}

</script>
