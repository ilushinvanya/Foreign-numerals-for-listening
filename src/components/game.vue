<template>
	<div class="main">
		<div id="score-wrap">
			<div id="all-games"></div>
			<div id="score"></div>
		</div>
		<div id="game" class="hide">

			<button id="repeat-btn" onclick="synth.repeat()">🧑🏼‍🦱🗣️🇬🇧</button>
			<button id="show-text" onclick="onHandleShowText()">Show text</button>
			<button id="show-example" onclick="onHandleShowNumber()">Show numbers</button>
			<div id="example"></div>
			<div class="input-wrap">
				<input id="input" type="number" name="answer" onkeydown="onHandleEnterInput(event)"/>
			</div>
			<button id="check" onclick="onHandleSubmitInput()">Check</button>
			<div id="points"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

// defineProps<{ msg: string }>()

const count = ref(0)
</script>

<style lang="stylus" scoped>
.main
	border 1px black solid
	height 74vh
	display flex
	flex-direction column
	align-items center
	justify-content center
	#score-wrap
		display flex
		justify-content space-around
		margin-bottom 10px
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

			#input
				padding 10px
				font-size 32px
				width 100%
		#points
			font-size 44px
			text-align center
			height 120px
			padding-top: 30px;
			&:before
				content 'points '

</style>
