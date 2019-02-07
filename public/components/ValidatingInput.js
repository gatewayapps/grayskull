import FormValidationMessage from './FormValidationMessage'
import React from 'react'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, className, ...props } = this.props
    const finalId = this.props.readOnly ? `ro-${name}` : name
    const validationClass = validationErrors[name] ? 'is-invalid' : 'is-valid'
    let inputComponent
    switch (props.type) {
      case 'photo': {
        inputComponent = <img className={className} {...props} src={props.value} />
        break
      }
      case 'textarea': {
        inputComponent = (
          <textarea
            id={finalId}
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
            className={`form-control ${className || ''} ${(this.state.blurred || this.props.value) && validationClass}`}
            {...props}
          />
        )
        break
      }
      case 'checkbox': {
        inputComponent = (
          <div className="form-check checkbox-slider-md checkbox-slider--b nofocus">
            <label className="m-0">
              <input id={finalId} name={name} type="checkbox" {...props} className={`${className || 'nofocus'}`} style={{ fontSize: '1.15rem', paddingBottom: 0 }} />
              <span className="nofocus" />
            </label>
          </div>
        )
        break
      }
      default: {
        inputComponent = (
          <input
            id={finalId}
            style={{ fontSize: '1.15rem', paddingBottom: 0 }}
            name={name}
            onBlur={() => {
              this.setState({ blurred: true })
            }}
            aria-describedby={`${name}HelpBlock`}
            className={`form-control ${className || ''} ${(this.state.blurred || this.props.value) && validationClass}`}
            {...props}
          />
        )
      }
    }

    return (
      <div>
        <div className="d-flex h-100 align-items-center ">{inputComponent}</div>
        <FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
      </div>
    )
  }
}
