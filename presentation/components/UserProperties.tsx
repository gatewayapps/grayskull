/* eslint-disable no-console */
import React, { useReducer } from 'react'

import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import { updatePropertyReducer } from '../utils/updateProperty'

type UserPropertiesProps = {
	userProperties: object[]
	updateState: (properties: object[]) => void
}

export const UserProperties: React.FC<UserPropertiesProps> = ({ userProperties, updateState }) => {
	const [state, dispatch] = useReducer(updatePropertyReducer, userProperties)

	return (
		<>
			{state && (
				<div className="overflow-auto" style={{ maxHeight: '300px' }}>
					{state.map((p, i) => {
						return (
							<>
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
											updateState(state)
										}}>
										<i className="fa fa-fw fa-times text-danger" />
									</div>
								</div>
							</>
						)
					})}
				</div>
			)}
			<button
				style={{ margin: '10px 0 0', paddingLeft: '0' }}
				className="btn btn-link"
				onClick={() => {
					dispatch({ type: 'add' })
					updateState(state)
				}}>
				Add Properties
			</button>
		</>
	)
}
