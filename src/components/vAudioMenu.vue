<template lang="pug">
	aside.v-audio-menu(:class="{ 'v-audio-menu--open': open }")
		header.v-audio-menu__header
			.content-wrapper
				.v-audio-menu__control.v-audio-menu__control--toggle(@click="toggleOpen")
					i.material-icons {{ open ? 'close' : 'queue_music' }}
				vAudio(ref="audio")
				.v-audio-menu__control.v-audio-menu__control--add
					vFileUpload(
						id="fileUpload"
						:accepted-file-types="['audio/*']"
						@upload="uploadFile"
					)
		section.v-audio-menu__body
			vTrackSelector(ref="trackSelector")
</template>

<script>
import { mapMutations } from 'vuex'
import { ADD_TRACK_TO_LIST } from '@/store/mutations.type'
import { vEvents } from '@/mixins'
import {
	E_FILE_UPLOAD,
	E_CLOSE_MENUS,
	E_SELECT_TRACK
} from '@/mixins/events/events.type'
import vAudio from '@/components/vAudio'
import vFileUpload from '@/components/vFileUpload'
import vTrackSelector from '@/components/vTrackSelector'

export default {
	name: 'vAudioMenu',
	mixins: [vEvents],
	components: {
		vAudio,
		vFileUpload,
		vTrackSelector
	},
	data() {
		this.upload = null

		return {
			open: false
		}
	},
	methods: {
		toggleOpen() {
			this.open = !this.open
		},
		uploadFile(file) {
			this[ADD_TRACK_TO_LIST](file)

			this.eventHub.$emit(E_FILE_UPLOAD, file)

			this.open = false
		},
		...mapMutations([ADD_TRACK_TO_LIST])
	},
	created() {
		this.eventHub.$on(E_CLOSE_MENUS, () => {
			this.open = false
		})
		this.eventHub.$on(E_SELECT_TRACK, this.toggleOpen.bind(this))
	}
}
</script>

<style lang="scss" scoped>
$audio-menu-body-height: 320px;

.v-audio-menu {
	position: absolute;
	top: 100%;
	width: 100%;
	height: 50vh;
	z-index: z("interface");
	opacity: 0.3;
	transition: transform $transition-duration-m, opacity $transition-duration-m;

	&:hover {
		opacity: 0.9;
	}

	&--open {
		opacity: 0.9;
		transform: translatey(-$audio-menu-body-height);

		.v-audio-menu__header {
			background-color: $gray-10;
			opacity: 0.9;
		}
	}

	&__header {
		position: absolute;
		transform: translatey(-100%);
		width: 100%;
		z-index: z("interface");
		transition: background-color $transition-duration-m;

		.content-wrapper {
			display: flex;
			align-items: flex-end;

			.v-audio {
				flex: 1;
			}
		}
	}

	&__body {
		height: $audio-menu-body-height;
		background-color: $gray-9;
		opacity: 0.9;
		overflow-y: scroll;
		z-index: z("content");

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__controls {
		transform: translatey(-143%);
		z-index: z("overlay");
	}

	&__control {
		position: relative;
		top: -$space-m;
		width: $space-l;
		height: $space-l;
		cursor: pointer;
	}
}
</style>
