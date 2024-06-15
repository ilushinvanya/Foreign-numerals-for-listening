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
			q-checkbox(v-model="voiceInput" label="Voice input")
			LanguageSelect(
				v-if="voiceInput"
				v-model="inputLanguage"
				:options="LANGUAGES"
				label="Input language"
			)
		q-separator(inset)
		q-card-section
			q-form(
				ref="form"
				@submit.prevent="start"
			)
				.row
					.col.q-pr-md
						q-input(
							v-model.number="min"
							type="number"
							filled
							dense
							label="Minimum"
							:rules="[required, moreZeroRule]"
							no-error-icon
						)
					.col
						q-input(
							v-model.number="max"
							type="number"
							filled
							dense
							label="Maximum"
							:rules="[required, maxMoreMin]"
							no-error-icon
						)
		q-separator(inset)
		q-card-section
			q-btn(@click="start") Save and Run
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useSettings, LANGUAGES } from '../store/useSettings'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import {useNotification} from "../hooks/useNotification";
import LanguageSelect from './language-select.vue'

const router = useRouter()
const $q = useQuasar()

const { setError } = useNotification()

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage, voiceInput } = storeToRefs(settingsStore)

const form = ref()

const start = () => {
	form.value.validate().then((success:boolean) => {
		if (success) {
			router.push('/test')
		}
		else {
			setError('Validation error')
		}
	})
}

const maxMoreMin = () => {
	return max.value > min.value || 'The maximum must be greater than the minimum'
}
const moreZeroRule = () => {
	return min.value >= 0 || 'Field must be greater than 0'
}
const required = () => {
	return !!min.value || 'Field required'
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
