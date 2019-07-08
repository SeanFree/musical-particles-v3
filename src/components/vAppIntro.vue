<template lang="pug">
	.v-app-intro(v-if="!skip")
		.content-wrapper
			.v-app-intro__step.v-app-intro__step--1(v-if="showStep1")
				p.v-app-intro__text Click here to open track selection
				i.material-icons.v-app-intro__indicator expand_more
			.v-app-intro__step.v-app-intro__step--2(v-if="showStep2")
				p.v-app-intro__text Select a track from the list
				i.material-icons.v-app-intro__indicator expand_more
			.v-app-intro__step.v-app-intro__step--3(v-if="showStep3")
				p.v-app-intro__text Click here to add an audio file
				p.v-app-intro__text You can also drag and drop a file anywhere on the screen
				i.material-icons.v-app-intro__indicator expand_more
			.v-app-intro__step.v-app-intro__step--4(v-if="showStep4")
				p.v-app-intro__text Visual controls are located here
				i.material-icons.v-app-intro__indicator expand_less
			.v-app-intro__step.v-app-intro__skip(v-if="showSkip" @click="skipIntro")
				p.v-app-intro__text Skip intro
</template>

<script>
export default {
	name: 'vAppIntro',
	data() {
		return {
			skip: false,
			classNames: [
				'.v-audio-menu__control--toggle',
				'.v-track-selector__track-list',
				'.v-file-upload__label',
				'.v-app__layer-menu'
			],
			steps: {
				0: true,
				1: true,
				2: true,
				3: true
			}
		}
	},
	computed: {
		showStep1() {
			return this.steps[0]
		},
		showStep2() {
			return !this.showStep1 && this.steps[1]
		},
		showStep3() {
			return !this.showStep1 && !this.showStep2 && this.steps[2]
		},
		showStep4() {
			return !this.showStep1 && !this.showStep2 && !this.showStep3 && this.steps[3]
		},
		showSkip() {
			return this.showStep1 || this.showStep2 || this.showStep3 || this.showStep4
		}
	},
	methods: {
		skipIntro() {
			this.skip = true
			localStorage.setItem('mpapp_skip_intro', true)
			this.$emit('skip-intro')
		},
		closeStep(index) {
			this.steps[index] = false
			document.querySelector(this.classNames[index]).onclick = null
		}
	},
	mounted() {
		if (localStorage.mpapp_skip_intro) {
			this.skip = true
		} else {
			this.classNames.forEach((className, index) => {
				document.querySelector(className).onclick = this.closeStep.bind(this, index)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.v-app-intro {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: z("overlay");
	pointer-events: none;

	.content-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		margin-top: 0;
	}

	&__text:not(:first-child) {
		margin-top: $space-s;
	}

	&__step {
		position: absolute;
		max-width: 132px;
		padding: $space-s;
		border-radius: 4px;
		background: $gray-10;
		box-shadow: $box-shadow-default;
		pointer-events: auto;

		&--1 {
			bottom: 55px;
			left: $space-m;

			.v-app-intro__indicator {
				left: 0;
				animation: down-up $animation-duration-s infinite;
			}
		}

		&--2 {
			bottom: 337px;
			right: $space-m;

			.v-app-intro__indicator {
				right: 0;
				animation: down-up $animation-duration-s infinite;
			}
		}

		&--3 {
			bottom: 55px;
			right: $space-m;

			.v-app-intro__indicator {
				right: 0;
				animation: down-up $animation-duration-s infinite;
			}
		}

		&--4 {
			top: 55px;
			right: $space-m;

			.v-app-intro__indicator {
				top: -$space-m;
				right: $space-2xs;
				animation: up-down $animation-duration-s infinite;
			}
		}
	}

	&__skip {
		top: $space-m;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}

	&__indicator {
		position: absolute;
	}
}

@keyframes down-up {
	50% {
		transform: translatey($space-xs);
	}
}

@keyframes up-down {
	50% {
		transform: translatey(-$space-xs);
	}
}
</style>
