<template lang="pug">
.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				div
					.text-h6
						span {{ outputLanguage?.flag }}
						span.q-px-sm Testing
						span(v-if="voiceInput") {{ inputLanguage?.flag }}
					.text-subtitle2 ⏱️️ {{ time / 10 }}
				.flex.items-center
					q-btn.q-mr-md(
						to="/"
						:icon="mdiCogs"
						round
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
					:icon="isSpeaking ? mdiVolumeHigh : mdiVolumeLow"
					size="28px"
					@click="speechCurrent"
				)
				q-btn.q-ml-md(
					v-if="voiceInput"
					round
					:outline="isListening"
					:text-color="isListening ? 'primary' : ''"
					:icon="isListening ? mdiMicrophone : mdiMicrophoneOff"
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
							color="green"
							@click="handleCheckButton"
							:icon="mdiCheck"
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useSettings } from '../store/useSettings'
import { useSpeechRecognition } from '../store/useSpeechRecognition'
import { useSpeechSynthesis } from '../store/useSpeechSynthesis'
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar'
import { useTimer } from '../hooks/useTimer';
import {
	mdiCheck,
	mdiMicrophone,
	mdiMicrophoneOff,
	mdiCogs,
	mdiAlertOutline,
	mdiAlertDecagramOutline,
	mdiVolumeHigh,
	mdiVolumeLow
} from '@mdi/js'

const $q = useQuasar()

// question
const digit = ref(0)
const digitText = computed(() => `${digit.value}`)

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage, voiceInput } = storeToRefs(settingsStore)

const totalPossibleValues = max.value - min.value + 1
const alreadyDigit = ref<number[]>([])
const isNoMoreOptions = computed(() => alreadyDigit.value.length === totalPossibleValues)
const getRandomInt = (mn:number, mx:number): number => {
	const min = Math.ceil(mn);
	const max = Math.floor(mx);
	const numb =  Math.floor(Math.random() * (max - min + 1)) + min;
	if(alreadyDigit.value.includes(numb)){
		if(isNoMoreOptions.value) alreadyDigit.value = []
		else if(!isNoMoreOptions.value) return getRandomInt(mn, mx)
	}
	alreadyDigit.value.push(numb)
	return numb
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
	stopInterval()
	if(check() === true) {
		$q.notify({
			icon: mdiCheck,
			type: 'positive',
			message: `Correctly «${digit.value}»`
		})
		score.value++
		numberOfIncorrectAnswers.value = 0
		allTests.value++
		setTimeout(runTest, 2000)
	}
	else {
		numberOfIncorrectAnswers.value++

		if (numberOfIncorrectAnswers.value < 3) {
			// неправильно, но можно повторить
			$q.notify({
				icon: mdiAlertOutline,
				type: 'warning',
				message: `Incorrect «${answer.value}». Try again`
			})
			answer.value = null
		}
		else {
			// непрвильно, ошибка
			$q.notify({
				icon: mdiAlertDecagramOutline,
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
onBeforeUnmount(() => {
	speechRecognitionStore.stop()
	speechSynthesisStore.shutUp()
})

// Recognition & Synthesis
const speechRecognitionStore = useSpeechRecognition()
const toggleMic = speechRecognitionStore.toggleMic
const { transcript, recognitionError, isListening } = storeToRefs(speechRecognitionStore)

const speechSynthesisStore = useSpeechSynthesis()
const { isSpeaking, synthesisError } = storeToRefs(speechSynthesisStore)

watch(recognitionError, (newValue) => {
	if(!voiceInput.value) return
	if(newValue) {
		$q.notify({
			icon: mdiAlertDecagramOutline,
			type: 'negative',
			message: `${newValue}`
		})
	}
})
watch(synthesisError, (newValue) => {
	if(newValue) {
		$q.notify({
			icon: mdiAlertDecagramOutline,
			type: 'negative',
			message: `${newValue}`
		})
	}
})

const { time, startInterval, stopInterval } = useTimer()
watch(isSpeaking, (newValue, oldValue) => {
	if(oldValue && !newValue) {
		if(!voiceInput.value) {
			startInterval()
			return
		}
		speechRecognitionStore.start()
	}
})
watch(isListening, (newValue, oldValue) => {
	if(!oldValue && newValue) {
		startInterval()
	}
	if(oldValue && !newValue) {
		stopInterval()
		if(!transcript.value) {
			$q.notify({
				icon: mdiAlertOutline,
				type: 'warning',
				message: `Didn't hear. Try again`
			})
			return
		}
		const parsedTranscript = parseInt(transcript.value)
		if(isNaN(parsedTranscript)) {
			$q.notify({
				icon: mdiAlertOutline,
				type: 'warning',
				message: `Incorrect «${transcript.value}». Try again`
			})
		} else {
			answer.value = parsedTranscript
			handleCheckButton()
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

</script>
