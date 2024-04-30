<template lang="pug">
.full-height.flex.justify-center.items-center
	q-card.main-card(bordered)
		q-card-section.flex.justify-between
			div(class="text-h6") Settings
		q-separator(inset)
		q-card-section
			LanguageSelect(
				v-model="outputLanguage"
				:options="LANGUAGES"
				label="Output language"
			)
		q-card-section
			LanguageSelect(
				v-model="inputLanguage"
				:options="LANGUAGES"
				label="Input language"
			)
		q-separator(inset)
		q-card-section
			.row
				.col.q-pr-md
					q-input(
						v-model.number="min"
						type="number"
						filled
						dense
						label="Minimum"
					)
				.col
					q-input(
						v-model.number="max"
						type="number"
						filled
						dense
						label="Maximum"
					)
		q-separator(inset)
		q-card-section
			q-btn(@click="start") Save and Run
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettings, LANGUAGES } from '../store/settings'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import LanguageSelect from './language-select.vue'

const router = useRouter()
const $q = useQuasar()

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage } = storeToRefs(settingsStore)

const start = () => {
	router.push('/test')
}

window.document.onload = () => {
	if (!settingsStore.Device.isChrome) {
		$q.dialog({
			title: 'Sorry',
			message: 'The Speech Recognition and Speech Synthesis APIs require the Google Chrome Browser to work.'
		})
	}
};

</script>
