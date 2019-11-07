import PropTypes from 'prop-types'
import React from 'react'
import ValidatingInput from './ValidatingInput'
export default class ResponsiveValidatingInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelColumnWidth: PropTypes.number,
    labelStyles: PropTypes.object,
    helpText: PropTypes.string,
    validationErrors: PropTypes.any
  }

  static defaultProps = {
    labelColumnWidth: 3,
    validationErrors: []
  }

  state = {
    blurred: false
  }
  render = () => {
    const { label, labelColumnWidth, ...props } = this.props

    const labelMediumColumnClass = `col-md-${labelColumnWidth}`
    const inputMediumColumnClass = `col-md-${12 - labelColumnWidth}`

    const finalClassName = `${this.props.readOnly ? 'form-control-plaintext border-bottom-0' : ''} ${this.props.className || ''}`

    return (
      <div className="form-group row align-items-start my-1">
        <label
          className={`d-none d-md-block col-sm-12 ${labelMediumColumnClass} col-form-label noselect`}
          style={{ fontSize: '0.725rem', textTransform: 'uppercase', opacity: 0.75, paddingTop: '1.25rem' }}
          htmlFor={props.name}>
          {label}
        </label>
        <div className={`col-sm-12 ${inputMediumColumnClass} align-self-center`}>
          <ValidatingInput className={finalClassName} placeholder={this.props.placeholder || label} {...props} />
        </div>
        {this.props.helpText && <small className="form-text text-muted col-12 py-0 my-0">{this.props.helpText}</small>}
      </div>
    )
  }
}
