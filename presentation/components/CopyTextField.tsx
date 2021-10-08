import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { UncontrolledPopover, PopoverBody } from 'reactstrap'

export interface CopyTextFieldProps {
	className?: string
	style?: React.CSSProperties
	text: string
	label: string
	id: string
	onCopy?: (text: string, result: boolean) => void
}

export const CopyTextField = ({
	className = 'd-flex align-items-end',
	style,
	text,
	label,
	id,
	onCopy
}: CopyTextFieldProps) => {
	return (
		<div className={className} style={style} id={id}>
			<div className="form-group" style={{ flex: 1 }}>
				<label className="input-group-text">{label}</label>
				<input type="text" className="form-control" readOnly value={text} />
			</div>
			<CopyToClipboard text={text} onCopy={onCopy}>
				<div className="mb-3 mx-3">
					<button
						role="button"
						id={`${id}-copy-button`}
						className="btn btn-outline-secondary"
						type="button"
						title="Copy to Clipboard">
						<i className="fa fa-fw fa-copy" />
					</button>
					<UncontrolledPopover trigger="focus" placement="top" target={`${id}-copy-button`}>
						<PopoverBody>Copied!</PopoverBody>
					</UncontrolledPopover>
				</div>
			</CopyToClipboard>
		</div>
	)
}
