import React from 'react'
import styled from 'styled-components'

export interface ResponsiveFormProps {
	formHeader: React.ReactNode
	formBody: React.ReactNode
	formFooter: React.ReactNode
	className?: string
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({ formHeader, formBody, formFooter, className }) => {
	return (
		<div className={`${className} card`}>
			<div className="card-header">
				<h5 className=" card-title m-0">{formHeader}</h5>
			</div>
			<div className="card-body pb-4">
				{formBody}
				<div style={{ height: '100px' }} />
			</div>
			<div className="card-footer">{formFooter}</div>
		</div>
	)
}

export default styled(ResponsiveForm)`
	@media (max-width: 768px) {
		margin: 0;
		border-radius: 0px !important;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		.card-header {
			.header-logo {
				width: 48px;
			}
		}
	}

	.card-body {
		flex: 1 1 auto;
		overflow-y: auto;
	}
`
