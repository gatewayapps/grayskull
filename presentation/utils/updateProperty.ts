/* eslint-disable no-console */
export const updatePropertyReducer = (state, action) => {
	switch (action.type) {
		case 'add': {
			return [...state, { key: '', value: '' }]
		}

		case 'remove': {
			if (state.length === 1) {
				return []
			}

			return state.filter((item, index) => index !== action.index)
		}

		case 'updateKey': {
			state[action.index].key = action.key

			return [...state]
		}
		case 'updateValue': {
			state[action.index].value = action.value

			return [...state]
		}
	}
}
