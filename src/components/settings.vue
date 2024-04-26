<template lang="pug">
	.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				div(class="text-h6") Settings
				q-btn(@click="getAllVoices" no-caps) Get languages
			q-separator(inset)
			q-card-section
				language-select(
					v-model="outputLanguage"
					:options="availableLanguages"
					label="Output language"
				)
			q-card-section
				language-select(
					v-model="inputLanguage"
					:options="availableLanguages"
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
import { useSettings } from '../store/settings'
import { useArtyom } from '../store/artyom'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import LanguageSelect from './language-select.vue'

const router = useRouter()
const $q = useQuasar()

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage } = storeToRefs(settingsStore)

const artyomStore = useArtyom()
const { availableLanguages } = storeToRefs(artyomStore)

const start = () => {
	router.push('/test')
}

const getAllVoices = () => {
	artyomStore.initVoices()
}

window.document.onload = () => {
	getAllVoices()
	const isSupported = artyomStore.isSupported()
	const detectDevice = artyomStore.detectDevice()
	if(!isSupported) {
		$q.dialog({
			title: 'Sorry',
			message: 'Is not supported'
		})
		return
	}
	if(detectDevice === 'isMobile') {
		// Artyom can talk and obey commands in this browser, however the voice will be the default voice of the device. Cannot force language here
	}
	if(!detectDevice) {
		$q.dialog({
			title: 'Sorry',
			message: 'App only works with The Google Chrome Browser !'
		})
	}
};

</script>
