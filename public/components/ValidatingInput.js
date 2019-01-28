import FormValidationMessage from './FormValidationMessage'
import React from 'react'
export default class ValidatingInput extends React.PureComponent {
  state = {
    blurred: false
  }
  render = () => {
    const { name, validationErrors, ...props } = this.props

    let inputComponent
    switch (props.type) {
      case 'textarea': {
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
        break
      }
      case 'checkbox': {
        inputComponent = (
          <div class="form-check checkbox-slider-md checkbox-slider--b nofocus">
            <label className="m-0">
              <input id={name} name={name} type="checkbox" {...props} className={`${this.props.className || 'nofocus'}`} />
              <span className="nofocus" />
            </label>
          </div>
        )
        break
      }
      default: {
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
    }

    return (
      <div>
        <div className="d-flex h-100 align-items-center ">{inputComponent}</div>
        <FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
      </div>
    )
  }
}
