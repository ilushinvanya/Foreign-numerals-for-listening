<template lang="pug">
.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				.flex.items-center
					.text-h6 Testing
					q-btn.q-ml-sm(
						to="/"
						round
						size="sm"
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
const speechRecognitionStore = useSpeechRecognitionStore()
const { transcript, recognitionError, isListening } = storeToRefs(speechRecognitionStore)

const speechSynthesisStore = useSpeechSynthesisStore()
const { isSpeaking, synthesisError } = storeToRefs(speechSynthesisStore)

watch(isSpeaking, (newValue, oldValue) => {
	if(oldValue && !newValue) {
		speechRecognitionStore.start()
	}
})

const numberOfIncorrectAnswers = ref(0)

watch(isListening, (newValue, oldValue) => {
	if(oldValue && !newValue) {
		if(!transcript.value) return;

		const parsedTranscript = parseInt(transcript.value)
		if(isNaN(parsedTranscript)) {
			$q.notify({
				type: 'negative',
				message: `Incorrect «${transcript.value}». Try again`
			})
		} else {
			answer.value = parsedTranscript
			setTimeout(handleCheckButton, 1000)
		}
	}
})

const settingsStore = useSettings()
const { min, max, outputLanguage } = storeToRefs(settingsStore)

const speech = (text: string) => {
	speechRecognitionStore.stop()
	speechSynthesisStore.speak(text)
}
const speechCurrent = () => {
	speech(digitText.value)
}

const digit = ref(0)
const digitText = computed(() => `${digit.value}`)

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

const wrongAnswer = ref<Map<number, number>>(new Map());
const sortedWrongAnswer = computed(() => {
	return [...wrongAnswer.value.entries()].sort((a, b) => b[1] - a[1])
})
const setWrongAnswer = () => {
	const currentWrong = wrongAnswer.value.get(digit.value)
	if(currentWrong) wrongAnswer.value.set(digit.value, currentWrong + 1)
	else wrongAnswer.value.set(digit.value, 1)
}

const check = (): true | number => {
	const check = digit.value === answer.value;
	if(check) return check;
	return digit.value;
}
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
			runTest()
		}
	}

}
const onClickWrongAnswer = (number: number) => {
	answer.value = null
	digit.value = number
	speech(digitText.value)
	answerInputEl.value?.focus()
}

//
const runTest = () => {
	answer.value = null
	generate()
	speech(digitText.value)
	answerInputEl.value?.focus()
}
onMounted(runTest)

const toggleMic = () => {
	if(isListening.value) {
		speechRecognitionStore.stop()
	}
	else {
		speechRecognitionStore.start()
	}
}
</script>
