<template lang="pug">
	.v-input__container
			label.v-input__label.v-input__label--select(
				:for="id"
			) {{ label }}
			select.v-input.v-input--select(
				v-model="currentValue"
				@change="onChange"
			)
				option(
					v-for="(option, index) in options"
					:key="index"
					:value="option"
					:selected="currentValue === option"
				) {{option}}
</template>

<script>
import { vInput } from '@/mixins'

export default {
	name: 'vDropdown',
	mixins: [vInput],
	props: {
		options: {
			type: Array,
			required: true
		}
	}
}
</script>

<style lang="scss" scoped>
.v-input--select {
	cursor: pointer;
	padding: $space-2xs;
	border: 0;
	border-radius: 2px;
	background-color: $gray-9;
	font-family: "Open Sans", sans-serif;
	color: $white;
	outline: none;
}
</style>
