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
		vAudioMenu(ref="menu")
		.v-app__drag-overlay(:class="{ 'v-app__drag-overlay--dragging': dragging }")
			i.material-icons.v-app__drag-icon note_add
		vAppIntro(@skip-intro="introSkipped")
</template>

<script>
import {
	mapGetters,
	mapMutations
} from 'vuex'
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
import vAudioMenu from '@/components/vAudioMenu'
import vAppIntro from '@/components/vAppIntro'
import VisualizerApp from '@/VisualizerApp'

export default {
	name: 'MusicalParticlesV3',
	components: {
		vLoader,
		vLayerMenu,
		vAudioMenu,
		vAppIntro
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
	},
	mounted() {
		const {
			canvas,
			menu: {
				$refs: {
					audio: {
						analyser
					}
				}
			}
		} = this.$refs

		window.visApp = new VisualizerApp(this, canvas, analyser)
		window.visApp.init()
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
	max-width: $breakpoint-4;
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

.v-button {
	box-sizing: border-box;
	padding: $space-xs $space-s;
	border-radius: 2px;
	font-family: "Open Sans", sans-serif;
	outline: none;
	color: $white;
	cursor: pointer;

	&--primary {
		background-color: $cyan-4;
		border: 0;
	}

	&--secondary {
		border: 1px solid;
		background-color: transparent;
		color: $cyan-4;
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
}
</style>
