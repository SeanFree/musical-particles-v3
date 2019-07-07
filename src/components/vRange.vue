<template lang="pug">
	.v-input__container
		label.v-input__label.v-input__label--range(
			:for="id"
		) {{ label }}
		input.v-input.v-input--range(
			type="range"
			v-model="currentValue"
			:id="id"
			:name="name || id"
			:min="min"
			:max="max"
			:step="step"
			@input="onChange"
		)
		span.v-input__value {{ currentValue }}
</template>

<script>
import { vInput } from '@/mixins'

export default {
	name: 'vRange',
	mixins: [vInput],
	props: {
		min: {
			type: Number,
			required: true
		},
		max: {
			type: Number,
			required: true
		},
		step: {
			type: Number,
			required: true
		}
	},
	methods: {
		onChange() {
			this.$emit('change', +this.currentValue)
		}
	}
}
</script>
