import FormValidationMessage from './FormValidationMessage'
import React from 'react'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, ...props } = this.props

    let inputComponent
    if (props.type === 'textarea') {
      inputComponent = (
        <textarea
          id={name}
          name={name}
          onBlur={() => {
            this.setState({ blurred: true })
          }}
          style={{
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'scroll',
            fontSize: '8pt'
          }}
          aria-describedby={`${name}HelpBlock`}
          className={`form-control ${(this.state.blurred || this.props.value) && (validationErrors[name] ? 'is-invalid' : 'is-valid')}`}
          {...props}
        />
      )
    } else {
      inputComponent = (
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
      )
    }

    return (
      <div>
        {inputComponent}
        <FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
      </div>
    )
  }
}
