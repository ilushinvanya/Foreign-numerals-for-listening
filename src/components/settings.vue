<template lang="pug">
	.full-height.flex.justify-center.items-center
		q-card.main-card(bordered)
			q-card-section.flex.justify-between
				div(class="text-h6") Settings
				q-btn(@click="getAllVoices" no-caps) Get languages
			q-separator(inset)
			q-card-section
				q-select(
					:disable="!availableLanguages.length"
					filled
					v-model="outputLanguage"
					:options="availableLanguages"
					option-label="flag"
					option-value="string"
					label="Output language"
				)
					template(v-slot:selected-item="scope")
						.flex.align-center.items-center
							.text-h5.q-mr-sm {{ scope.opt.flag }}
							.text-caption.text-capitalize {{ scope.opt.description }}
					template(v-slot:option="scope")
						q-item(v-bind="scope.itemProps")
							q-item-label.flex.align-center.items-center
								.text-h5.q-mr-sm {{ scope.opt.flag }}
								.text-caption.text-capitalize {{ scope.opt.description }}
			//q-card-section
			//	q-select(
			//		:disable="!availableLanguages.length"
			//		filled
			//		v-model="inputLanguage"
			//		:options="availableLanguages"
			//		option-label="flag"
			//		option-value="string"
			//		label="Input language"
			//	)
			//		template(v-slot:selected-item="scope")
			//			.flex.align-center.items-center
			//				.text-h5.q-mr-sm {{ scope.opt.flag }}
			//				.text-caption.text-capitalize {{ scope.opt.description }}
			//		template(v-slot:option="scope")
			//			q-item(v-bind="scope.itemProps")
			//				q-item-label.flex.align-center.items-center
			//					.text-h5.q-mr-sm {{ scope.opt.flag }}
			//					.text-caption.text-capitalize {{ scope.opt.description }}
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

const emit = defineEmits(['start'])
const $q = useQuasar()

$q.dark.set(false)

const settingsStore = useSettings()
const { min, max, outputLanguage, inputLanguage } = storeToRefs(settingsStore)

const artyomStore = useArtyom()
const { availableLanguages } = storeToRefs(artyomStore)

const start = () => {
	emit('start')
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
		$q.notify('Artyom can talk and obey commands in this browser, however the voice will be the default voice of the device. Cannot force language here.')
	}
	if(!detectDevice) {
		$q.dialog({
			title: 'Sorry',
			message: 'Artyom only works with The Google Chrome Browser !'
		})
	}
};

</script>
