import PropTypes from 'prop-types'
import React from 'react'
import ValidatingInput from './ValidatingInput'
export default class ResponsiveValidatingInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelColumnWidth: PropTypes.number,
    labelStyles: PropTypes.object,
    helpText: PropTypes.string,
    validationErrors: PropTypes.array
  }

  static defaultProps = {
    labelColumnWidth: 3
  }

  state = {
    blurred: false
  }

  renderControl = () => {
    const { name, ...props } = this.props

    let inputComponent = null
    switch (props.type) {
      case 'textarea': {
        inputComponent = (
          <textarea
            id={name}
            placeholder={this.props.label}
            name={name}
            style={{
              whiteSpace: 'pre',
              overflowWrap: 'normal',
              overflowX: 'scroll',
              fontSize: '8pt'
            }}
            aria-describedby={`${name}HelpBlock`}
            className={`form-control`}
            {...props}
          />
        )
        break
      }
      case 'checkbox': {
        inputComponent = (
          <div className="form-check checkbox-slider-md checkbox-slider--b nofocus">
            <label className="m-0">
              <input id={name} name={name} type="checkbox" {...props} className={`${this.props.className || 'nofocus'}`} />
              <span className="nofocus" />
            </label>
          </div>
        )
        break
      }
      default: {
        inputComponent = <input placeholder={this.props.label} id={name} name={name} aria-describedby={`${name}HelpBlock`} className={`form-control`} {...props} />
      }
    }
    return inputComponent
  }

  render = () => {
    const { label, labelColumnWidth, ...props } = this.props

    const labelMediumColumnClass = `col-md-${labelColumnWidth}`
    const inputMediumColumnClass = `col-md-${12 - labelColumnWidth}`

    return (
      <div className="form-group row">
        <label className={`d-none d-md-block col-sm-12 ${labelMediumColumnClass} col-form-label noselect`} style={this.props.labelStyles} htmlFor={props.name}>
          {label}
        </label>
        <div className={`col-sm-12 ${inputMediumColumnClass}`}>{this.renderControl()}</div>
        {this.props.helpText && <small className="form-text text-muted col-12 py-0 my-0">{this.props.helpText}</small>}
      </div>
    )
  }
}
