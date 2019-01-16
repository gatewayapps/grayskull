import FormValidationMessage from './FormValidationMessage'
import React from 'react'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, ...props } = this.props

    return (
      <div>
        <input
          id={name}
          name={name}
          onBlur={() => {
            this.setState({ blurred: true })
          }}
          aria-describedby={`${name}HelpBlock`}
          className={`form-control ${(this.state.blurred || this.props.value) && (validationErrors[name] ? 'is-invalid' : 'is-valid')}`}
          {...props}
        />
        <FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
      </div>
    )
  }
}
