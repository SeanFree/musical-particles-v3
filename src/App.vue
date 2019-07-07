<template lang="pug">
	main#app.v-app(
		@dragenter.prevent="onDragEnter"
		@dragover.prevent
		@dragleave.prevent="onDragLeave"
		@drop.prevent="onDrop"
	)
		canvas.v-app__canvas(
			ref="canvas"
			@click="canvasClicked"
		)
		header.v-app__header
			.content-wrapper
				.v-app__loader
					vLoader(:loading="loadingTrack")
				.v-app__layer-menu
					vLayerMenu(ref="layerMenu" :layers="layers")
		v-audio-menu(ref="menu")
		.v-app__drag-overlay(:class="{ 'v-app__drag-overlay--dragging': dragging }")
			i.material-icons.v-app__drag-icon note_add
		v-app-intro(@skip-intro="introSkipped")
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { LOADING_TRACK } from '@/store/getters.type'
import { SET_TRACK_LIST } from '@/store/mutations.type'
import {
	E_FILE_DROPPED,
	E_CLOSE_MENUS,
	E_SELECT_TRACK
} from '@/mixins/events/events.type'
import { vEvents } from '@/mixins'
import vLoader from '@/components/vLoader'
import vLayerMenu from '@/components/vLayerMenu'

export default {
	name: 'MusicalParticlesV3',
	components: {
		vLoader,
		vLayerMenu
	},
	mixins: [vEvents],
	computed: {
		...mapGetters([LOADING_TRACK])
	},
	data() {
		return {
			dragging: false,
			layers: {},
			tracks: [
				{
					fileName: 'verdidiesirae.mp3',
					title: 'Messa da Reqiuem: Dies Irae',
					artist: 'Giuseppi Verdi'
				},
				{
					fileName: 'lisztcampanella.mp3',
					title: 'La Campanella',
					artist: 'Franz Liszt'
				},
				{
					fileName: 'saintsaensdansemacabre.mp3',
					title: 'Danse Macabre',
					artist: 'Camille Saint-Saëns'
				},
				{
					fileName: 'satiegnossienne1.mp3',
					title: 'Gnoissienne No. 1',
					artist: 'Erik Satie'
				},
				{
					fileName: 'holstmars.mp3',
					title: 'Mars, Bringer of War',
					artist: 'Gustav Holst'
				}
			]
		}
	},
	methods: {
		addLayerControl(name, icon, options) {
			this.$set(this.layers, name, {
				icon,
				options
			})
		},
		onDragEnter() {
			this.dragging = true
		},
		onDragLeave() {
			this.dragging = false
		},
		onDrop($event) {
			const { dataTransfer } = $event

			this.eventHub.$emit(E_FILE_DROPPED, dataTransfer.files)

			this.dragging = false
		},
		canvasClicked() {
			this.eventHub.$emit(E_CLOSE_MENUS, true)
		},
		introSkipped() {
			this.eventHub.$emit(E_SELECT_TRACK, this.tracks[0])
			this.$refs.menu.open = false
		},
		...mapMutations([SET_TRACK_LIST])
	},
	created() {
		this[SET_TRACK_LIST](this.tracks)
	}
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300&display=swap');

.material-icons {
	font-size: $size-xl;
	color: $white;

	&::selection {
		background-color: transparent;
	}
}

.content-wrapper {
	max-width: $breakpoint-3;
	padding: 0 $space-m;
	margin: $space-m auto 0;
	box-sizing: border-box;
}

.v-app {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: $black;
	font-family: "Open Sans", sans-serif;
	color: $white;
	overflow: hidden;

	&__canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: z("background");
		width: 100vw;
		height: 100vh;
	}

	&__header {
		position: relative;
		z-index: z("interface");

		.content-wrapper {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
		}
	}

	&__drag-overlay {
		position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: $gray-10;
    opacity: 0;
		z-index: z("overlay");
		pointer-events: none;
		transition: opacity $transition-duration-s;

		&--dragging {
			opacity: 0.8;
		}
	}

	&__drag-icon {
		font-size: $size-4xl;
    color: $cyan-2;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translatex(-50%) translatey(-50%);
    border: 4px solid;
    border-radius: 50%;
    padding: $space-m;
	}
}

.v-input {
	&__container {
		padding: $space-s $space-m;
	}

	&__container,
	&__label--checkbox {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	&__label {
		flex: 1;

		&--checkbox {
			cursor: pointer;
		}

		&--select,
		&--range {
			margin-right: $space-m;
		}
	}

	&__value {
		width: $space-xl;
		padding: $space-2xs;
		border-radius: 2px;
		background-color: $gray-9;
		text-align: right;
		cursor: default;
	}

	&--checkbox {
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

	&--text {
		padding: $space-xs $space-s;
		border: 0;
		border-radius: 2px;
		margin: 0 0 $space-s;
		background: $gray-9;
		font-family: "Open Sans", sans-serif;
		color: $white;
		outline: none;

		&:focus {
			outline: none;
		}

		&::-webkit-input-placeholder {
			color: $gray-5;
		}

		&::-moz-placeholder {
			color: $gray-5;
		}

		&:-ms-input-placeholder {
			color: $gray-5;
		}

		&:-moz-placeholder {
			color: $gray-5;
			opacity: 1;
		}
	}

	&--select {
		cursor: pointer;
		padding: $space-2xs;
		border: 0;
		border-radius: 2px;
		background-color: $gray-9;
		font-family: "Open Sans", sans-serif;
		color: $white;
		outline: none;
	}

	&--range {
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
			height: 14px;
			width: 14px;
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
			height: 16px;
			width: 16px;
			border-radius: 50%;
			border: 2px solid $gray-8;
			background: transparent;
			cursor: ew-resize;
			-webkit-appearance: none;
			margin-top: -7px;
		}
	}
}
</style>
