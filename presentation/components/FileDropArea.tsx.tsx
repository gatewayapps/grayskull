import cn from 'classnames'

import prettyBytes from 'pretty-bytes-es5'
import React, { useState } from 'react'

import Dropzone from 'react-dropzone'
import styled from 'styled-components'

const MAX_FILE_SIZE = 20000000 // 10MB <-- Thats some neat math.  2000000 = 10MB?

export interface IFileDropAreaProps {
	'aria-describedby': string
	className?: string
	disabled?: boolean
	onFilesChanged?: (files: File[]) => void

	maxNumberFiles?: number
	style?: React.CSSProperties
	value?: string
}

const DropArea = styled.div`
	border: 2px dashed transparent;
	cursor: pointer;
	&.empty {
		border-color: #666;
		border-color: var(--gray);
		border-radius: 1rem;
	}

	&.is-invalid {
		border-color: #e51c23;
		border-color: var(--danger);
	}

	&.active {
		border-color: #222;
		border-color: var(--gray-dark);
	}
`
const FileDropArea: React.FC<IFileDropAreaProps> = (props) => {
	const [message, setMessage] = useState('')
	const onDrop = (acceptedFiles: File[], rejectedFiles: File[]) => {
		rejectedFiles.forEach((file) => {
			if (file.size > MAX_FILE_SIZE) {
				setMessage(
					`The file "${file.name}" with a size of ${prettyBytes(
						file.size
					)} is too large to upload. The maximum upload file size is ${prettyBytes(MAX_FILE_SIZE)}.`
				)
				return
			} else {
				setMessage(`The file "${file.name}" could not be uploaded.`)
				return
			}
		})
		if (props.maxNumberFiles !== undefined && acceptedFiles.length > props.maxNumberFiles) {
			setMessage(`Only ${props.maxNumberFiles} file(s) are allowed.`)
			return
		}

		if (props.onFilesChanged) {
			props.onFilesChanged(acceptedFiles)
		}
	}

	if (message) {
		console.error(message)
	}

	return (
		<Dropzone
			disabled={props.disabled}
			maxSize={MAX_FILE_SIZE}
			onDrop={(accepted, rejected) => onDrop(accepted, rejected)}>
			{({ getRootProps, getInputProps, isDragActive }) => {
				const dropAreaClasses = cn(props.className, {
					active: isDragActive,
					empty: !props.value
				})

				return (
					<DropArea {...getRootProps()} className={dropAreaClasses} style={props.style}>
						<input {...getInputProps()} aria-describedby={props['aria-describedby']} />
						{props.value ? <div className="alert alert-info">{props.value}</div> : props.children}
					</DropArea>
				)
			}}
		</Dropzone>
	)
}

export default FileDropArea
