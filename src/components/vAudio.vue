<template lang="pug">
	aside.v-audio
		.v-audio__container(:class="{ 'v-audio--disabled': !userInitialized || loading }")
			audio.audio(
				@canplaythrough="setTotalTime"
				@timeupdate="updateProgress"
				@ended="audioEnded"
			)
			h5.v-audio__track-title {{ trackTitle }}
			ul.v-audio__controls
				li.v-audio__control
					i.material-icons(@click="cyclePlaythroughType") {{ playthroughType }}
				li.v-audio__control
					i.material-icons(@click="skipPrevious") skip_previous
				li.v-audio__control.v-audio__control--play-pause
					i.material-icons(@click="playPause") {{ playing ? 'pause_circle_outline' : 'play_circle_outline' }}
				li.v-audio__control
					i.material-icons(@click="skipNext") skip_next
				li.v-audio__control.v-audio__control--volume
					i.material-icons(@click="toggleMute") {{ volumeType }}
					input.v-input.v-input--range.v-audio__input--volume(
						type="range"
						min="0"
						max="1"
						step="0.05"
						v-model="volume"
						@input="setVolume($event.target.value)"
					)
			.v-audio__progress
				span.v-audio__current-time {{ currentTime }}
				progress(
					value="0"
					max="1"
					ref="progressBar"
					@click="setTime"
				)
				span.v-audio__total-time {{ totalTime }}
</template>

<script>
import {
	ST_CONST,
	MIN_DB,
	MAX_DB,
	FFT_SIZE
} from '@/constants'
import {
	mapActions,
	mapGetters
} from 'vuex'
import { SELECT_TRACK } from '@/store/actions.type'
import {
	SELECTED_TRACK,
	TRACK_LIST
} from '@/store/getters.type'
import { vEvents } from '@/mixins'
import {
	E_FILE_UPLOAD,
	E_SELECT_TRACK
} from '@/mixins/events/events.type'
import {
	round,
	rand,
	ceil,
	sToTime
} from '@/common/util'

export default {
	name: 'vAudio',
	mixins: [vEvents],
	data() {
		this.volume = 0.8
		this.previousVolume = 0.8
		this.maxVolume = 1
		this.muted = false
		this.element = null
		this.source = null
		this.ctx = null
		this.gainNode = null
		this.analyser = null
		this.fileData = null
		this.skipAmount = 10
		this.playthroughTypes = ['repeat', 'repeat_one', 'shuffle']
		this.volumeTypes = ['volume_off', 'volume_down', 'volume_up']

		return {
			userInitialized: false,
			playing: false,
			loading: false,
			currentIndex: 0,
			currentTime: '0:00',
			totalTime: '0:00',
			playthroughType: 'repeat',
			volumeType: 'volume_down'
		}
	},
	computed: {
		trackTitle() {
			return this[SELECTED_TRACK].artist
				? `${this[SELECTED_TRACK].artist} - ${this[SELECTED_TRACK].title}`
				: ''
		},
		...mapGetters([SELECTED_TRACK, TRACK_LIST])
	},
	methods: {
		async changeTrack() {
			this.playing = true
			this.loading = false
			this.element.src = URL.createObjectURL(this[SELECTED_TRACK].data)
			this.element.play()
		},
		playPause() {
			this.element[this.playing ? 'pause' : 'play']()

			this.playing = !this.playing
		},
		toggleMute() {
			this.setVolume(this.muted ? this.previousVolume : 0)

			this.muted = !this.muted
		},
		setVolume(newVolume) {
			this.previousVolume = this.volume
			this.gainNode.gain.value = this.volume = newVolume
			this.volumeType = this.volumeTypes[ceil(this.volume * (this.volumeTypes.length - 1))]
		},
		async skipPrevious() {
			if (this.playthroughType === 'shuffle') {
				await this.randomizeSelection()
			} else {
				this.currentIndex =
					this.currentIndex > 0
						? this.currentIndex - 1
						: this[TRACK_LIST].length - 1
			}

			this.continuePlaylist()
		},
		async skipNext() {
			if (this.playthroughType === 'shuffle') {
				await this.randomizeSelection()
			} else {
				this.currentIndex =
					this.currentIndex < this[TRACK_LIST].length - 1
						? this.currentIndex + 1
						: 0
			}

			this.continuePlaylist()
		},
		async continuePlaylist() {
			await this[SELECT_TRACK](this[TRACK_LIST][this.currentIndex])
			await this.changeTrack()
		},
		async randomizeSelection() {
			let selection = round(rand(this[TRACK_LIST].length - 1))

			while (selection === this.currentIndex) {
				selection = round(rand(this[TRACK_LIST].length - 1))
			}

			this.currentIndex = selection

			this.continuePlaylist()
		},
		async audioEnded() {
			this.element.currentTime = 0
			this.element.pause()

			if (this.playthroughType === 'repeat') {
				await this.skipNext()
			} else if (this.playthroughType === 'shuffle') {
				await this.randomizeSelection()
			} else {
				await this.changeTrack()
			}
		},
		async userSelection(track) {
			this.ctx.resume()
			this.element.pause()
			this.playing = false
			this.loading = true

			await this[SELECT_TRACK](track)

			this.currentIndex = this[TRACK_LIST].indexOf(track)

			await this.changeTrack()

			this.userInitialized = true
		},
		async fileUploaded() {
			this.currentIndex = this[TRACK_LIST].length - 1

			await this.changeTrack()

			this.userInitialized = true
		},
		cyclePlaythroughType() {
			const index = this.playthroughTypes.indexOf(this.playthroughType)

			this.playthroughType = this.playthroughTypes[index < this.playthroughTypes.length - 1 ? index + 1 : 0]
		},
		setTime($event) {
			this.element.currentTime =
				this.element.duration * ($event.offsetX / $event.target.offsetWidth)
		},
		setTotalTime() {
			this.totalTime = sToTime(this.element.duration)
		},
		updateProgress() {
			const value = this.element.currentTime / this.element.duration || 0

			this.$refs.progressBar.value = value
			this.currentTime = sToTime(this.element.currentTime)
		},
		...mapActions([SELECT_TRACK])
	},
	mounted() {
		this.eventHub.$on(E_SELECT_TRACK, this.userSelection.bind(this))
		this.eventHub.$on(E_FILE_UPLOAD, this.userSelection.bind(this))

		this.element = this.$el.querySelector('audio')
		this.ctx = new AudioContext()
		this.source = this.ctx.createMediaElementSource(this.element)

		this.gainNode = this.ctx.createGain()
		this.setVolume(this.volume)

		this.analyser = this.ctx.createAnalyser()
		this.analyser.smoothingTimeConstant = ST_CONST
		this.analyser.minDecibels = MIN_DB
		this.analyser.maxDecibels = MAX_DB
		this.analyser.fftSize = FFT_SIZE

		this.source.connect(this.gainNode)
		this.gainNode.connect(this.analyser)
		this.analyser.connect(this.ctx.destination)
	}
}
</script>

<style lang="scss" scoped>
.v-audio {
	width: 100%;
	z-index: z("interface");

	&__track-title {
		margin: $space-s 0;
		color: $white;
		font-size: $size-s;
		font-weight: bold;
		text-align: center;
		text-shadow: 0 0 4px $black;

		@include tablet {
			font-size: $size-m;
		}

		@include desktop {
			font-size: $size-l;
		}
	}

	&__container {
		position: relative;
		padding: $space-s $space-m;
		transition: opacity $transition-duration-m;
	}

	&__controls {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
		margin-bottom: $space-s;
	}

	&__control {
		position: relative;

		.material-icons {
			font-size: $size-l;
			padding: $space-xs;
			cursor: pointer;
		}

		&--play-pause .material-icons {
			font-size: $size-2xl;
		}

		&:not(:last-child) {
			margin-right: $space-m;
		}

		.material-icons:active {
			transform: scale(0.85);
		}

		&--volume {
			.v-input {
				display: flex;
				align-items: center;
				position: absolute;
				top: calc(50% - #{0.65 * $space-m});
				left: $space-l;
				width: 72px;
				padding-left: $space-s;
				opacity: 0;
			}

			&:hover > .v-input {
				opacity: 1;
			}
		}
	}

	&__current-time,
	&__total-time {
		display: inline-block;
		font-size: $size-xs;
	}

	&__progress {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: $space-s;

		progress[value] {
			width: 100%;
			max-width: 440px;
			height: $space-xs;
			display: block;
			border: 0;
			border-radius: 0.5 * $space-xs;
			margin: 0 $space-m;
			cursor: pointer;
			appearance: none;
			overflow: hidden;

			&::-webkit-progress-bar {
				background-color: $gray-8;
				border-radius: 0.5 * $space-xs;
			}

			&::-webkit-progress-value {
				background-color: $cyan-2;
				border-radius: 0.5 * $space-xs;
			}

			&::-moz-progress-bar {
				background-color: $cyan-2;
				border-radius: 0.5 * $space-xs;
			}
		}
	}

	&--disabled {
		pointer-events: none;
		opacity: 0.5;

		.material-icons {
			color: $gray-6;
		}
	}
}
</style>
