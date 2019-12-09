import React from 'react'
import PropTypes from 'prop-types'
export default class StateButton extends React.Component {
  static propTypes = {
    state: PropTypes.string,
    states: PropTypes.object
  }

  render = () => {
    const { className, state, states, ...props } = this.props
    return (
      <button className={[className, states[state].className].join(' ')} {...props}>
        {states[state].render(this.props)}
      </button>
    )
  }
}
