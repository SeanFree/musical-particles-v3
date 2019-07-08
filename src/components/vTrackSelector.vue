<template lang="pug">
	section.v-track-selector
		ol.v-track-selector__track-list
			li.v-track-selector__list-item(
				v-for="(track, index) in trackList"
				:key="`track-${index}`"
				:class="{ 'v-track-selector__list-item--selected': track.fileName === selectedTrack.fileName }"
				@click="selectTrack(track)"
			)
				.content-wrapper
					span.v-track-selector__artist {{ track.artist }}
					span.v-track-selector__title {{ track.title }}
					i.material-icons music_note
</template>

<script>
import {
	mapGetters,
	mapMutations
} from 'vuex'
import {
	SELECTED_TRACK,
	TRACK_LIST
} from '@/store/getters.type'
import { SET_SELECTED_TRACK } from '@/store/mutations.type'
import { vEvents } from '@/mixins'
import { E_SELECT_TRACK } from '@/mixins/events/events.type'

export default {
	name: 'vTrackSelector',
	mixins: [vEvents],
	computed: {
		...mapGetters([SELECTED_TRACK, TRACK_LIST])
	},
	methods: {
		selectTrack(track) {
			this[SET_SELECTED_TRACK](track)
			this.eventHub.$emit(E_SELECT_TRACK, track)
		},
		...mapMutations([SET_SELECTED_TRACK])
	}
}
</script>

<style lang="scss">
.v-track-selector {
	background-color: $gray-9;

	.content-wrapper {
		margin-top: 0;
	}

	&__track-list {
		font-size: $size-s;
	}

	&__list-item {
		border-bottom: 1px solid transparentize($gray-10, 0.5);
		cursor: pointer;

		.content-wrapper {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			padding: $space-s $space-m;

			@include tablet {
				flex-direction: row;
			}
		}

		.material-icons {
			position: absolute;
			top: 50%;
			right: $space-m;
			display: none;
			font-size: $size-l;
			color: $cyan-2;
			transform: translatey(-50%);
		}

		&--selected {
			.content-wrapper {
				padding-right: $space-2xl;
			}

			.material-icons {
				display: inline;
			}
		}

		&:hover {
			background: $gray-8;
		}
	}

	&__artist {
		text-align: left;
		margin-top: $space-s;

		&:before {
			display: inline-block;
		}

		@include tablet {
			margin-top: 0;
			text-align: right;
		}
	}
}
</style>
