import FormValidationMessage from './FormValidationMessage'
import React from 'react'
import AdaptiveInput from './AdaptiveInput'

export interface IValidatingInputProps {
  name: string
  validationErrors: any[]
  readOnly: boolean
  className: string
  type: any
  value: any
  id: any
}

const ValidatingInput: React.FC<IValidatingInputProps> = ({ name, validationErrors, className, ...props }) => {
  const readOnlyClass = props.readOnly ? 'border-bottom-0' : ''
  const validationClass = validationErrors[name] ? 'is-invalid' : props.readOnly ? '' : 'is-valid'

  const finalProps = Object.assign(props, {
    id: props.id || name,
    name: name,
    className: `${className} ${readOnlyClass} ${validationClass}`
  })
  const inputComponent = <AdaptiveInput {...finalProps} />

  return (
    <div>
      <div className="d-flex h-100 align-items-center ">{inputComponent}</div>
      <FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
    </div>
  )
}

export default ValidatingInput