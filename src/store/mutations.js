import {
	SET_TRACK_LOADING,
	SET_SELECTED_TRACK,
	SET_TRACK_LIST,
	ADD_TRACK_TO_LIST
} from './mutations.type.js'

import {
	LOADING_TRACK,
	TRACK_LIST,
	SELECTED_TRACK
} from './getters.type'

export default {
	[SET_TRACK_LOADING](state, payload) {
		state[LOADING_TRACK] = payload
	},
	[SET_SELECTED_TRACK](state, payload) {
		state[SELECTED_TRACK] = payload
	},
	[SET_TRACK_LIST](state, payload) {
		state[TRACK_LIST] = payload
	},
	[ADD_TRACK_TO_LIST](state, payload) {
		state[TRACK_LIST].push(payload)
	}
}
