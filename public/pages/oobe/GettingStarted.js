import React from 'react'
import PropTypes from 'prop-types'

export class GettingStarted extends React.PureComponent {
  componentDidMount() {
    this.props.onValidationChanged(this.props.stepIndex, true)
  }

  render() {
    return (
      <div>
        <p className="card-text">
          This is a first time setup process to help you configure Grayskull for your needs. Before we get started, make sure you have completed the following steps:
        </p>

        <ul className="list-group card-text">
          <li className="list-group-item">Have a persistent volume mounted to /usr/local/grayskull with read/write permissions</li>
        </ul>
        <p className="card-text mt-4">If you are ready to get started, click Next below</p>
      </div>
    )
  }
}

GettingStarted.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  onValidationChanged: PropTypes.func.isRequired
}
