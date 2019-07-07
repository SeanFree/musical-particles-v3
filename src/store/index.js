import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import {
	LOADING_TRACK,
	TRACK_LIST,
	SELECTED_TRACK
} from './getters.type'

const state = {
	[LOADING_TRACK]: false,
	[TRACK_LIST]: [],
	[SELECTED_TRACK]: {}
}

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})
