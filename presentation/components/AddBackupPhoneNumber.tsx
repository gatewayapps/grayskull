import React, { useState } from 'react'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'

export const AddBackupPhoneNumber: React.FC = () => {
	const [phoneNumber, setPhoneNumber] = useState('')
	return (
		<ResponsiveValidatingInput
			type="phone"
			name="phoneNumber"
			value={phoneNumber}
			placeholder="Mobile Phone Number"
			onChange={(e) => {
				setPhoneNumber(e.target.value)
			}}
		/>
	)
}
