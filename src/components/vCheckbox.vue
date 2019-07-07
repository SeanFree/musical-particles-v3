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
		}
	}
}
</script>
