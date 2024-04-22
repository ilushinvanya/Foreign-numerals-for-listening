<template>
	<Game v-if="isStart"/>
	<Settings v-if="isOpenSettings" @start="firstRun"/>
</template>

<script setup lang="ts">
import Game from './components/game.vue'
import Settings from './components/settings.vue'
import { ref } from 'vue'

const isOpenSettings = ref(true)
const isStart = ref(false)

const firstRun = () => {
	isOpenSettings.value = false
	isStart.value = true
}
</script>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
}

.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
