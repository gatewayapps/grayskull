import React from 'react'
import PropTypes from 'prop-types'

export class GettingStarted extends React.PureComponent<any> {
  componentDidMount() {
    this.props.onValidationChanged(this.props.stepIndex, true)
  }

  render() {
    return (
      <div>
        <p className="card-text">This is a first time setup process to help you configure Grayskull for your needs.</p>

        <p className="card-text mt-4">If you are ready to get started, click Next below</p>
      </div>
    )
  }
}

export default GettingStarted
