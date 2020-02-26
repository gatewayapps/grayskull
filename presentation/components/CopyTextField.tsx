import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { UncontrolledPopover, PopoverBody } from 'reactstrap'

export interface CopyTextFieldProps {
	className: string
	style: object
	text: string
	label: string
	id: string
	onCopied: any
}

export default class CopyTextField extends React.Component<CopyTextFieldProps, any> {
	static defaultProps = {
		className: 'd-flex align-items-end'
	}
	public render() {
		return (
			<div className={this.props.className} id={this.props.id}>
				<div className="form-group" style={{ flex: 1 }}>
					<label className="input-group-text">{this.props.label}</label>

					<input type="text" className="form-control" readOnly value={this.props.text} />
				</div>
				<CopyToClipboard text={this.props.text} onCopied={this.props.onCopied}>
					<div className="mb-3 mx-3">
						<button
							role="button"
							id={`${this.props.id}-copy-button`}
							className="btn btn-outline-secondary"
							type="button"
							title="Copy to Clipboard">
							<i className="fa fa-fw fa-copy" />
						</button>
						<UncontrolledPopover trigger="focus" placement="top" target={`${this.props.id}-copy-button`}>
							<PopoverBody>Copied!</PopoverBody>
						</UncontrolledPopover>
					</div>
				</CopyToClipboard>
			</div>
		)
	}
}
