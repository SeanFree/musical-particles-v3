import Vue from 'vue'

const eventHub = new Vue()
export default Vue.mixin({
	data() {
		return {
			eventHub
		}
	}
})
