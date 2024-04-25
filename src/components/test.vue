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
					// по клику включать или выключать микро
					q-btn(
						v-if="isListen"
						round
						size="sm"
					) 🎙
				div
					div All tests: {{allTests}}
					div Score: {{score}}
			q-separator(inset)
			q-card-section.flex.justify-center
				q-btn(
					round
					size="28px"
					@click="speechCurrent"
				) 🔉{{ outputLanguage?.flag }}

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
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '../store/settings'
import { useArtyom } from '../store/artyom'
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.dark.set(true)

// question
const artyomStore = useArtyom()

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage } = storeToRefs(settingsStore)

const length = max.value - min.value + 1
const answers = Array.from({ length: length }, (_, i) => `${i + min.value}`)

const numberOfIncorrectAnswers = ref(0)
const initArtyom = async () => {
	await artyomStore.init(inputLanguage.value?.code)
	artyomStore.artyom.addCommands({
		indexes: answers,
		action: (i:number) => {
			const answ = answers[i]
			if(answ === digitText.value) {
				answer.value = answ
				setTimeout(handleCheckButton, 1000)
			}
			else {
				numberOfIncorrectAnswers.value++
				$q.notify({
					type: 'negative',
					message: `Incorrect ${answ}. Try again`
				})
				if(numberOfIncorrectAnswers.value === 3) {
					answer.value = answ
					handleCheckButton()
					numberOfIncorrectAnswers.value = 0
				}
			}
		}
	})
}
initArtyom()

const speech = (text: string) => {
	artyomStore.say(text, {
		lang: outputLanguage.value?.code,
		onEnd:() => {
			artyomStore.artyom.obey()
			// artyomStore.artyom.dontObey();
		}
	});
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

const answer = ref<string>();
const answerInputEl = ref();

const wrongAnswer = ref<Map<number, number>>(new Map());
const sortedWrongAnswer = computed(() => {
	return [...wrongAnswer.value.entries()].sort((a, b) => b[1] - a[1])
})

const check = (): true | number => {
	const check = digitText.value === answer.value;
	if(check) return check;
	return digit.value;
}
const handleCheckButton = () => {
	if(check() === true) {
		$q.notify({
			type: 'positive',
			message: `Correctly ${digit.value}`
		})
		score.value++
	}
	else {
		$q.notify({
			type: 'negative',
			message: `Wrong ${digit.value}`
		})
		score.value--
		const currentWrong = wrongAnswer.value.get(digit.value)
		if(currentWrong) wrongAnswer.value.set(digit.value, currentWrong + 1)
		else wrongAnswer.value.set(digit.value, 1)
	}
	initTest()
	allTests.value++
}

const initTest = () => {
	answer.value = ''
	generate()
	speech(digitText.value)
	answerInputEl.value?.focus()
}
onMounted(initTest)

const onClickWrongAnswer = (number: number) => {
	digit.value = number
	answer.value = ''
	speech(digitText.value)
	answerInputEl.value?.focus()
}

const isListen = ref(false)
setInterval(() => {
	isListen.value = artyomStore.isRecognizing()
}, 1000)

</script>
