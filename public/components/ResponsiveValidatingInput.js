import PropTypes from 'prop-types'
import React from 'react'
import ValidatingInput from './ValidatingInput'
export default class ResponsiveValidatingInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    labelColumnWidth: PropTypes.number,
    labelStyles: PropTypes.object,
    helpText: PropTypes.string
  }

  static defaultProps = {
    labelColumnWidth: 3
  }

  state = {
    blurred: false
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
        <div className={`col-sm-12 ${inputMediumColumnClass}`}>
          <ValidatingInput placeholder={label} {...props} />
        </div>
        {this.props.helpText && <small className="form-text text-muted col-12 py-0 my-0">{this.props.helpText}</small>}
      </div>
    )
  }
}
