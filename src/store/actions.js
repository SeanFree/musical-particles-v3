import axios from 'axios'
import {
	SET_TRACK_LOADING,
	SET_SELECTED_TRACK
} from './mutations.type'

import {
	FETCH_FILE_FROM_HOST,
	SELECT_TRACK
} from './actions.type'

import { HOST_URL } from '@/constants'

export default {
	async [FETCH_FILE_FROM_HOST]({ commit }, track) {
		const { fileName } = track

		commit(SET_TRACK_LOADING, true)

		try {
			const { status, statusText, data } = await axios.get(
				`${HOST_URL}${fileName}`,
				{
					responseType: 'blob'
				}
			)

			if (status === 200) {
				track.data = data
			} else {
				console.error({ status, statusText })
			}
		} catch (err) {
			console.error(err)
		} finally {
			commit(SET_TRACK_LOADING, false)
		}
	},
	async [SELECT_TRACK]({ commit, dispatch }, track) {
		if (!track.data) {
			await dispatch(FETCH_FILE_FROM_HOST, track)
		}

		commit(SET_SELECTED_TRACK, track)
	}
}
