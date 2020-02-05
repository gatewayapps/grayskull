import PropTypes from 'prop-types'
import React from 'react'
import AdaptiveInput from './AdaptiveInput'

export default class ResponsiveInput extends React.PureComponent {
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

  render = () => {
    const { name, className, label, labelColumnWidth, ...props } = this.props

    const readOnlyClass = props.readOnly ? 'border-bottom-0' : ''

    const finalProps = Object.assign(props, {
      id: this.props.id || name,
      name: name,
      className: `${className} ${readOnlyClass}`
    })

    const labelMediumColumnClass = `col-md-${labelColumnWidth}`
    const inputMediumColumnClass = `col-md-${12 - labelColumnWidth}`

    return (
      <div className="form-group row align-items-start my-1">
        <label
          className={`d-md-block col-sm-12 ${labelMediumColumnClass} col-form-label noselect`}
          style={{ fontSize: '0.725rem', textTransform: 'uppercase', opacity: 0.75, paddingTop: '1.25rem' }}
          htmlFor={props.name}>
          {label}
        </label>
        <div className={`col-sm-12 ${inputMediumColumnClass} align-self-center`}>
          <AdaptiveInput {...finalProps} />
        </div>
        {this.props.helpText && <small className="form-text text-muted col-12 py-0 my-0">{this.props.helpText}</small>}
      </div>
    )
  }
}
