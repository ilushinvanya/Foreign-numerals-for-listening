<template>
	<div class="start">
		<button id="run" onclick="init()">New Game</button>
		<div class="range">
			<input id="min-a" type="number" name="min-range" value="10" placeholder="min a"/>
			<input id="max-a" type="number" name="max-range" value="50" placeholder="max a"/>
			<span>➕</span>
			<input id="min-b" type="number" name="min-range" value="1" placeholder="min b"/>
			<input id="max-b" type="number" name="max-range" value="5" placeholder="max b"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// defineProps<{ msg: string }>()

const count = ref(0)
</script>

<style scoped>

</style>
