<template lang="pug">
	.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				.text-h6 Testing
				#score-wrap
					div all games: {{allGames}}
					div score: {{score}}
			q-separator(inset)
			q-card-section.flex.justify-center
				q-btn(
					size="28px"
					round
					@click="speech"
				) 🔉{{ outputLanguage?.flag }}
				//q-btn(
				//	size="28px"
				//	round
				//	@click="speech"
				//) 🎙
			q-card-section.flex
				q-input(
					style="width: 100%"
					v-model.number="answer"
					type="number"
					outlined
					hint="Answer"
					ref="answerInputEl"
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
			q-separator(inset)
			q-card-section(v-if="sortedWrongAnswer.length")
				div
					p Mistakes
					q-chip(v-for="n in sortedWrongAnswer")
						q-avatar(color="red" text-color="white") {{n[1]}}
						span {{ n[0] }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '../store/settings'
import { useArtyom } from '../store/artyom'
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar'

const $q = useQuasar()

// question
const settingsStore = useSettings()
const { min, max, outputLanguage } = storeToRefs(settingsStore)

const artyomStore = useArtyom()

artyomStore.init()

// artyomStore.artyom.addCommands({
// 	indexes: ["0","1", "2"],
// 	action: (i:number) => {
// 		console.log('i', i)
// 	}
// });

const speech = () => {
	artyomStore.say(`${digit.value}`, {
		lang: outputLanguage.value.code,
	});
}

const digit = ref(0);
const getRandomInt = (mn:number, mx:number): number => {
	const min = Math.ceil(mn);
	const max = Math.floor(mx);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generate = () => {
	digit.value = getRandomInt(min.value, max.value);
}


// answer
const allGames = ref(0);
const score = ref(0);

const answer = ref();
const answerInputEl = ref();

const wrongAnswer = ref<Map<number, number>>(new Map());
const sortedWrongAnswer = computed(() => {
	return [...wrongAnswer.value.entries()].sort((a, b) => b[1] - a[1])
})

const check = (): true | number => {
	const check = digit.value === parseInt(answer.value);
	if(check) return check;
	return digit.value;
}
const handleCheckButton = () => {
	if(check() === true) {
		$q.notify({
			type: 'positive',
			message: `Correctly️ ${digit.value}`
		})
		score.value++
	}
	else {
		$q.notify({
			type: 'negative',
			message: `Wrong️ ${digit.value}`
		})
		score.value--
		const currentWrong = wrongAnswer.value.get(digit.value)
		if(currentWrong) wrongAnswer.value.set(digit.value, currentWrong + 1)
		else wrongAnswer.value.set(digit.value, 1)
	}
	init()
	allGames.value++
}

const init = () => {
	answer.value = null
	generate()
	speech()
	answerInputEl.value?.focus()
}
onMounted(init)

</script>

<style lang="stylus" scoped>
.main
	border 1px black solid
	height 74vh
	display flex
	flex-direction column
	align-items center
	justify-content center
	overflow hidden
	#score-wrap
		display flex
		align-items start
		flex-direction column
		padding 10px
		width 320px
		#all-games:before
			content 'all games '

		#score:before
			content 'total score '

	#game
		width 320px
		display flex
		flex-direction column

		&.hide
			display none


		#repeat-btn
			font-size 44px

		#example
			font-size 44px
			font-family math
			margin-top 10px
			text-align center

		#check
			font-size 32px

		.input-wrap
			margin 10px 0

			input
				padding 10px
				font-size 32px
				width 100%
		#points
			display flex
			align-items end
			flex-direction column
			font-size 18px
			height 120px
			padding-top: 0px;
			border-top 1px white solid

</style>
