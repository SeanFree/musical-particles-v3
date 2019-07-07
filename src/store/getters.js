import {
	LOADING_TRACK,
	TRACK_LIST,
	SELECTED_TRACK
} from './getters.type'

export default {
	[LOADING_TRACK](state) {
		return state[LOADING_TRACK]
	},
	[TRACK_LIST](state) {
		return state[TRACK_LIST]
	},
	[SELECTED_TRACK](state) {
		return state[SELECTED_TRACK]
	}
}
