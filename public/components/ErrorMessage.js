import PropTypes from 'prop-types'

const ErrorMessage = (props) => (
  <div className="alert alert-danger" role="alert">
    {props.error.message}
  </div>
)

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired
  }).isRequired
}

export default ErrorMessage
