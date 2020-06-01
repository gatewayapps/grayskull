import React, { useState, useRef, useEffect } from 'react'
import { AdaptiveInputProps } from './index'
export const OTPInput: React.FC<AdaptiveInputProps> = (props) => {
	const val: string = props.value || ',,,,,'
	const valParts = val.split(',')
	const [focusedIndex, setFocusedIndex] = useState(0)
	const currentInput = useRef<any>(null)

	const onValueChanged = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
		if (/\d/.test(e.key)) {
			valParts[i] = e.key
			if (i < 5) {
				setFocusedIndex(i + 1)
			}
		}

		if (e.key === 'ArrowLeft') {
			if (i > 0) {
				setFocusedIndex(i - 1)
			}
		}
		if (e.key === 'ArrowRight') {
			if (i < 5) {
				setFocusedIndex(i + 1)
			}
		}

		if (e.key === 'Backspace' || e.key === 'Delete') {
			if (currentInput.current && currentInput.current.value !== '') {
				valParts[i] = ''
			} else {
				if (i > 0) {
					valParts[i - 1] = ''
					setFocusedIndex(i - 1)
				}
			}
		}
		if (props.onChange) {
			props.onChange({ target: { name: props.name, value: valParts.join(',') } })
		}
	}

	useEffect(() => {
		if (currentInput.current) {
			currentInput.current.focus()
		}
	}, [focusedIndex])

	const setValueFromText = (text: string) => {
		let sanitized = text.replace(/[^0-9]/g, '')
		if (sanitized.length > 6) {
			sanitized = sanitized.substr(0, 6)
		}
		for (let i = 0; i < sanitized.length; i++) {
			valParts[i] = sanitized[i]
		}
		if (props.onChange) {
			props.onChange({ target: { name: props.name, value: valParts.join(',') } })
		}
		setFocusedIndex(5)
	}

	if (!currentInput.current && val !== ',,,,,') {
		if (props.onChange) {
			props.onChange({ target: { name: props.name, value: valParts.join(',') } })
		}
	}

	return (
		<div>
			{valParts.map((v, i) => (
				<input
					onPaste={(e) => {
						const clipboardText = e.clipboardData.getData('text')
						if (clipboardText) {
							setValueFromText(clipboardText)
							e.clipboardData.clearData('text')
						}
					}}
					key={`otp-${props.name}-${i}`}
					name={i === 0 ? props.name : undefined}
					className="form-control mr-1 d-inline-block"
					type="text"
					ref={i === focusedIndex ? currentInput : undefined}
					value={v}
					onKeyDown={(e) => {
						onValueChanged(e, i)
					}}
					onFocus={() => {
						setFocusedIndex(i)
					}}
					onChange={(e) => {
						if (/\d\d\d\d\d\d/.test(e.target.value)) {
							setValueFromText(e.target.value)
						}
					}}
					maxLength={1}
					style={{
						width: '50px',
						fontSize: '1.2rem',
						fontWeight: 'bold',
						textAlign: 'center',
						border: '1px solid',
						borderRadius: '4px'
					}}
				/>
			))}
		</div>
	)
}
