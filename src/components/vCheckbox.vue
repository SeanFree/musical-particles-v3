<template lang="pug">
	.v-input__container
		label.v-input__label.v-input__label--checkbox(
			:for="id"
		) {{ label }}
			input.v-input.v-input--checkbox(
				type="checkbox"
				v-model="currentValue"
				:id="id"
				:name="name || id"
				:checked="checked"
				@change="onChange"
			)
			.v-input--checkbox__el(@click="onChange")
				i.material-icons check
</template>

<script>
import { vInput } from '@/mixins'

export default {
	name: 'vCheckbox',
	mixins: [vInput],
	props: {
		checked: {
			type: Boolean,
			required: false
		},
		value: {
			type: Boolean,
			required: false
		}
	}
}
</script>

<style lang="scss">
.v-input--checkbox {
	display: none;

	&:checked + &__el {
		.material-icons {
			opacity: 1;
			transform: scale(1);
		}
	}

	&__el {
		width: $size-s;
		height: $size-s;
		border-radius: 2px;
		background-color: $gray-9;
		cursor: pointer;

		.material-icons {
			font-size: $size-s;
			color: $cyan-2;
			opacity: 0;
			transform: scale(0.8);
			transition: opacity $transition-duration-s, transform $transition-duration-s;
		}
	}
}
</style>
