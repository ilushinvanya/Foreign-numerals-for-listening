<template lang="pug">
q-select(
		v-model="model"
		:disable="!options.length"
		filled
		:options="options"
		option-label="flag"
		option-value="string"
		:label="label"
		:dropdown-icon="mdiMenuDown"
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

</template>

<script setup lang="ts">
import type { ILanguage } from '../store/settings';
import { mdiMenuDown } from '@mdi/js';

interface IProps {
	options: ILanguage[];
	label: string;
}

defineProps<IProps>()

const model = defineModel()

</script>
