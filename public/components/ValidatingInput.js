import FormValidationMessage from './FormValidationMessage'
import React from 'react'
import AdaptiveInput from './AdaptiveInput'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, className, ...props } = this.props

    const readOnlyClass = props.readOnly ? 'border-bottom-0' : ''
    const validationClass = validationErrors[name] ? 'is-invalid' : props.readOnly ? '' : 'is-valid'

    const finalProps = Object.assign(props, {
      id: this.props.id || name,
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
}
