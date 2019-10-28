import React from 'react'
import PropTypes from 'prop-types'

const FormValidationMessage = (props) => {
  if (!props.validationErrors || props.validationErrors.length === 0) {
    return null
  }

  return (
    <small id={props.id} className="form-text text-danger">
      {props.validationErrors.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </small>
  )
}

FormValidationMessage.propTypes = {
  id: PropTypes.string.isRequired,
  validationErrors: PropTypes.arrayOf(PropTypes.string)
}

export default FormValidationMessage
