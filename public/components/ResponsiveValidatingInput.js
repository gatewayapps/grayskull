import PropTypes from 'prop-types'
import React from 'react'
import ValidatingInput from './ValidatingInput'
export default class ResponsiveValidatingInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string
  }

  state = {
    blurred: false
  }
  render = () => {
    const { label, ...props } = this.props

    return (
      <div className="form-group row">
        <label className="d-none d-md-block col-sm-12 col-md-3 col-form-label" htmlFor={props.name}>
          {label}
        </label>
        <div className="col-sm-12 col-md-9">
          <ValidatingInput placeholder={label} {...props} />
        </div>
      </div>
    )
  }
}
