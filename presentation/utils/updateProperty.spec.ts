import { updatePropertyReducer } from './updateProperty'

describe('updatePropertyReducer', () => {
	it('should correctly add a new property to the state', () => {
		const state = []
		const action = { type: 'add' }
		const newState = updatePropertyReducer(state, action)

		expect(newState).toEqual([{ key: '', value: '' }])
	})

	it('should correctly remove a property from the state', () => {
		const state = [
			{ key: 'first', value: 'first_value' },
			{ key: 'second', value: 'second_value' }
		]

		const action = { type: 'remove', index: 0 }
		const newState = updatePropertyReducer(state, action)

		expect(newState).toEqual([{ key: 'second', value: 'second_value' }])
	})

	it('should correctly update a property key in the state', () => {
		const state = [{ key: 'first', value: 'first_value' }]

		const action = { type: 'updateKey', index: 0, key: 'second' }

		const newState = updatePropertyReducer(state, action)

		expect(newState).toEqual([{ key: 'second', value: 'first_value' }])
	})

	it('should correctly update a property value in the state', () => {
		const state = [{ key: 'first', value: 'first_value' }]

		const action = { type: 'updateValue', index: 0, value: 'second_value' }

		const newState = updatePropertyReducer(state, action)

		expect(newState).toEqual([{ key: 'first', value: 'second_value' }])
	})
})
