import React from 'react'
export const FormRow: React.FC = ({ children }) => {
	return (
		<div className="row" style={{ alignItems: 'center' }}>
			{children}
		</div>
	)
}
