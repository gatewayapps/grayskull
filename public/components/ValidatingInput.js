import React from 'react'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, ...props } = this.props

    return (
      <input
        id={name}
        name={name}
        onBlur={() => {
          this.setState({ blurred: true })
        }}
        className={`form-control ${this.state.blurred && (validationErrors[name] ? 'is-invalid' : 'is-valid')}`}
        {...props}
      />
    )
  }
}
