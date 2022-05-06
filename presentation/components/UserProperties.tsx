/* eslint-disable no-console */
import React, { useCallback, useEffect, useReducer } from 'react'

import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import { updatePropertyReducer } from '../utils/updateProperty'

type UserPropertiesProps = {
	userProperties: object[]
	isEditing: boolean
	updateState: (properties: object[]) => void
	isKeyValueValid: (value: boolean) => void
}

export const UserProperties: React.FC<UserPropertiesProps> = ({
	userProperties,
	isEditing,
	updateState,
	isKeyValueValid
}) => {
	const initialState = [...userProperties]
	const [state, dispatch] = useReducer(updatePropertyReducer, initialState)

	const hasOriginalKeys = useCallback(() => {
		return state.some((s, i) => {
			for (const st of state) {
				if (s.index !== i) return st.key?.toLowerCase() === s.key?.toLowerCase()
			}
		})
	}, [state])

	const showInvalidKeyError = useCallback(() => {
		return state.some((s) => s.key?.trim() === '' || s.key === null || s.key === undefined)
	}, [state])

	const showInvalidValueError = useCallback(() => {
		return state.some((s) => s.value?.trim() === '' || s.value === null || s.value === undefined)
	}, [state])

	useEffect(() => {
		updateState(state)
		isKeyValueValid(!showInvalidKeyError() && !showInvalidValueError() && !hasOriginalKeys())
	}, [state, showInvalidValueError, showInvalidKeyError, hasOriginalKeys])

	const showMatchKeyError = hasOriginalKeys()

	return (
		<>
			{!isEditing && (
				<>
					{state && (
						<div className="overflow-auto" style={{ maxHeight: '100px' }}>
							<p>Properties</p>
							{state.map((p) => {
								return (
									<>
										<span
											key={p.index}
											style={{
												fontSize: '0.725rem',
												textTransform: 'uppercase',
												opacity: 0.75
											}}>
											{p.key} : {p.value}
										</span>
										<br />
									</>
								)
							})}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<>
					{state && (
						<>
							{state.map((p, i) => {
								return (
									<React.Fragment key={i}>
										<div
											key={`${p.index}-${i}`}
											className="d-flex flex-row justify-content-between justify-content-center items-content-center">
											<div>
												<ResponsiveValidatingInput
													label={`key`}
													name={`key`}
													type={'text'}
													value={p.key}
													onChange={(e) => dispatch({ type: 'updateKey', index: i, key: e.target.value })}
												/>
											</div>
											<div>
												<ResponsiveValidatingInput
													label={`value`}
													name={`value`}
													type={'text'}
													value={p.value}
													onChange={(e) => dispatch({ type: 'updateValue', index: i, value: e.target.value })}
												/>
											</div>
											<div
												className="d-flex justify-content-center flex-column"
												onClick={() => {
													dispatch({ type: 'remove', index: i })
												}}>
												<i className="fa fa-fw fa-times text-danger" />
											</div>
										</div>
									</React.Fragment>
								)
							})}
						</>
					)}
					<div className="d-flex flex-column">
						<div className="d-flex justify-content-around">
							{showInvalidKeyError() && <span className="alert alert-warning">Keys are required</span>}
							{showInvalidValueError() && <span className="alert alert-warning">Values are required</span>}
						</div>
						{showMatchKeyError && <span className="alert alert-warning">Key names must be unique</span>}
						<button
							style={{ margin: '10px 0 0', paddingLeft: '0' }}
							className="btn btn-link justify-start"
							onClick={() => {
								dispatch({ type: 'add' })
							}}>
							Add Properties
						</button>
					</div>
				</>
			)}
		</>
	)
}
