import React from 'react'

export interface ButtonProps {
	onClick: () => void
	className?: string
}

export const CancelButton: React.FC<ButtonProps> = ({ children, onClick, className }) => {
	const content = children || (
		<>
			<i className="fa fa-fw fa-times" /> Cancel
		</>
	)
	return (
		<button className={`btn btn-outline-danger ${className}`} onClick={onClick}>
			{content}
		</button>
	)
}
