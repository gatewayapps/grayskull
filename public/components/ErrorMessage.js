import PropTypes from 'prop-types'

const ErrorMessage = (props) => {
  if (!props.error) {
    return null
  }

  return (
    <div className="alert alert-danger" role="alert">
      {props.error.message}
    </div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  })
}

export default ErrorMessage
