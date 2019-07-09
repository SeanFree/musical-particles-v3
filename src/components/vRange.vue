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
		},
		value: {
			type: Number,
			required: false
		}
	},
	methods: {
		onChange() {
			this.$emit('change', +this.currentValue)
		}
	}
}
</script>

<style lang="scss">
$input-range-thumb-radius: 14px;

.v-input--range {
	height: $space-m;
	margin-right: $space-s;
	background-color: transparent;
	color: transparent;
	cursor: pointer;
	-webkit-appearance: none;
	transition: opacity $transition-duration-s;

	&:focus {
		outline: none;
	}

	&::-webkit-slider-runnable-track {
		width: 100%;
		height: $space-2xs;
		-webkit-appearance: none;
		background: $gray-8;
	}

	&::-webkit-slider-thumb {
		position: relative;
		margin-top: -0.4 * $size-xs;
		height: $size-xs;
		width: $size-xs;
		border-radius: 50%;
		background: $cyan-2;
		-webkit-appearance: none;
	}

	&::-moz-slider-runnable-track {
		width: 100%;
		height: 2px;
		background: $gray-8;
	}

	&::-moz-slider-thumb {
		height: $input-range-thumb-radius;
		width: $input-range-thumb-radius;
		border-radius: 50%;
		background: $cyan-2;
		cursor: pointer;
		-webkit-appearance: none;
		margin-top: -6px;
	}

	&::-moz-range-track {
		width: 100%;
		height: 2px;
		cursor: pointer;
		background: $gray-8;
	}

	&::-moz-range-thumb {
		height: $input-range-thumb-radius;
		width: $input-range-thumb-radius;
		border-radius: 50%;
		border: 0;
		background: $cyan-2;
		cursor: ew-resize;
		-webkit-appearance: none;
		margin-top: -7px;
	}
}
</style>
