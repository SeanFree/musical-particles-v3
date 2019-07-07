export default {
	data() {
		return {
			currentValue: null
		}
	},
	props: {
		id: {
			type: String,
			required: true
		},
		label: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: false
		},
		value: {
			type: String,
			required: false
		}
	},
	methods: {
		onChange() {
			this.$emit('change', this.currentValue)
		}
	},
	created() {
		this.currentValue = this.value
	}
}
