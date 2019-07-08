<template lang="pug">
	.v-file-upload
		form.v-file-upload__form(
			:name="`form-${name || id}`"
			:id="`form-${id}`"
			@submit.prevent="uploadFile"
			@reset.prevent="cancelUpload"
		)
			input.v-file-upload__file-input(
				type="file"
				ref="fileInput"
				:name="`file-input-${name || id}`"
				:id="`file-input-${id}`"
				:accept="accept"
				@change="startUpload"
			)
			label.v-file-upload__label(:for="`file-input-${id}`")
				i.material-icons playlist_add
			transition(name="v-file-upload__info-input")
				fieldset.v-file-upload__info-input(v-if="uploadStarted")
					legend.v-file-upload__legend Enter a Title &amp; Artist
					input.v-input.v-input--text.v-file-upload__text-input(
						type="text"
						placeholder="Title"
						:id="`text-input-${id}-title`"
						:name="`text-input-${name || id}-title`"
						v-model="title"
					)
					input.v-input.v-input--text.v-file-upload__text-input(
						:id="`text-input-${id}-artist`"
						type="text"
						:name="`text-input-${name || id}-artist`"
						placeholder="Artist"
						v-model="artist"
					)
					.v-file-upload__controls
						button.v-button.v-button--primary.v-file-upload__submit(
							type="submit"
						) Submit
						button.v-button.v-button--secondary.v-file-upload__submit(
							type="reset"
						) Cancel
</template>

<script>
import { vEvents } from '@/mixins'
import { E_FILE_DROPPED } from '@/mixins/events/events.type'
import * as id3 from 'id3js'

export default {
	name: 'vFileUpload',
	mixins: [vEvents],
	props: {
		id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: false
		},
		acceptedFileTypes: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			title: null,
			artist: null,
			uploadStarted: false
		}
	},
	computed: {
		accept() {
			return this.acceptedFileTypes.join()
		}
	},
	methods: {
		async startUpload() {
			let artist
			let title

			const tags = await id3.fromFile(this.$refs.fileInput.files[0])

			if (tags) {
				({ artist, title } = tags)

				this.artist = artist
				this.title = title
			}

			this.uploadStarted = true
		},
		cancelUpload() {
			this.uploadStarted = false
		},
		uploadFile() {
			this.$emit('upload', {
				fileName: this.$refs.fileInput.files[0].name,
				data: this.$refs.fileInput.files[0],
				title: this.title,
				artist: this.artist
			})
			this.title = null
			this.artist = null
			this.$refs.fileInput.files = null
			this.uploadStarted = false
		},
		fileDropped($data) {
			this.$refs.fileInput.files = $data

			this.startUpload()
		}
	},
	created() {
		this.fileReader = new FileReader()
	},
	mounted() {
		this.eventHub.$on(E_FILE_DROPPED, this.fileDropped.bind(this))
	}
}
</script>

<style lang="scss" scoped>
.v-file-upload {
	position: relative;
	z-index: z("overlay");

	&__form {
		cursor: default;
	}

	&__file-input {
		display: none;
	}

	&__label {
		cursor: pointer;
	}

	&__legend {
		float: left;
		margin-bottom: $space-m;
	}

	&__info-input {
		position: absolute;
		right: 0;
		bottom: $space-xl;
		padding: $space-m;
		border-radius: 4px;
		background: $gray-10;
		box-shadow: $box-shadow-default;

		&-enter-active,
		&-leave-active {
			transition: transform $transition-duration-s, opacity $transition-duration-s;
		}

		&-enter,
		&-leave-to {
			opacity: 0;
			transform: translatey($space-xs);
		}
	}

	&__controls {
		display: flex;
		padding-top: $space-s;

		.v-button {
			display: inline-block;
			flex: 1;

			&:first-child {
				margin-right: $space-s;
			}
		}
	}
}
</style>
