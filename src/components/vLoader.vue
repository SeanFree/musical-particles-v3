<template lang="pug">
	transition(name="v-loader" tag="div")
		.v-loader__container(v-if="loading")
			span.v-loader__circle.v-loader__circle--parent
				span.v-loader__circle.v-loader__circle--child
					span.v-loader__circle.v-loader__circle--child
						span.v-loader__circle.v-loader__circle--child
							span.v-loader__circle.v-loader__circle--child
</template>

<script>
import { vEvents } from '@/mixins'

export default {
	name: 'vLoader',
	mixins: [vEvents],
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style lang="scss" scoped>
.v-loader {
	display: flex;
	height: $space-m;
	pointer-events: none;
	z-index: z("interface");

	&-enter-active,
	&-leave-active {
		transition: opacity $transition-duration-l;
	}

	&-enter,
	&-leave-to {
		opacity: 0;
	}

	&__container {
		position: relative;
		width: $space-2xl;
		height: $space-2xl;
	}

	&__circle {
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		box-sizing: border-box;
		border: 2px solid;
		border-color: transparent $cyan-3 $cyan-3 transparent;
		border-radius: 50%;
		transform: translatex(-50%) translatey(-50%);
		animation: rotate $animation-duration-l infinite;

		&--parent {
			width: 100%;
			height: 100%;
		}

		&--child {
			width: calc(100% - 2px);
			height: calc(100% - 2px);
		}
	}
}

@keyframes rotate {
	100% {
		transform: translatex(-50%) translatey(-50%) rotate(360deg);
	}
}
</style>
