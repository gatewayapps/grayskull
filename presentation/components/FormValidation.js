import debounce from 'lodash/debounce'
import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Validator from 'validator'

export class FormValidationRule {
  constructor(field, test, validWhen, message, args) {
    this.field = field
    this.test = test
    this.validWhen = validWhen
    this.message = message
    this.args = args
  }
}

function getValue(data, field) {
  if (!data || !field) {
    return undefined
  }

  return field.split('.').reduce((result, prop) => {
    if (!result || !prop) {
      return undefined
    }
    return result[prop]
  }, data)
}

class FormValidation extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isValid: false,
      validationErrors: {},
      validating: false
    }
  }

  componentDidMount() {
    if (this.props.data && this.props.validateOnMount) {
      this.onValidate(this.props.data)
    }
  }

  onValidate = debounce(async (data) => {
    if (!Array.isArray(this.props.validations) || this.props.validations.length === 0) {
      this.setState({
        validationErrors: {},
        isValid: true,
        validating: false
      })
    }

    this.setState({ validating: true })

    data = data || this.props.data

    const validationErrors = {}

    for (let i = 0; i < this.props.validations.length; i++) {
      const rule = this.props.validations[i]
      const testFn = typeof rule.test === 'string' ? Validator[rule.test] : rule.test
      if (typeof testFn === 'function') {
        const value = getValue(data, rule.field)
        const finalValue = typeof rule.test === 'string' && typeof value !== 'string' ? value.toString() : value
        const args = rule.args || []
        const validWhen = rule.validWhen || false

        let testResult
        try {
          testResult = await testFn(finalValue, ...args)
        } catch {
          testResult = undefined
        }

        if (testResult !== validWhen) {
          if (!Array.isArray(validationErrors[rule.field])) {
            validationErrors[rule.field] = [rule.message]
          } else {
            validationErrors[rule.field].push(rule.message)
          }
        }
      }
    }

    const isValid = Object.keys(validationErrors).length === 0

    this.setState({
      isValid,
      validationErrors,
      validating: false
    })

    if (this.props.onValidated) {
      this.props.onValidated(isValid, validationErrors)
    }
  }, 300)

  render() {
    return this.props.children({
      validationErrors: this.state.validationErrors,
      isValid: this.state.isValid,
      validate: this.onValidate
    })
  }
}

FormValidation.defaultProps = {
  validateOnMount: true
}

FormValidation.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.any,
  validateOnMount: PropTypes.bool,
  onValidated: PropTypes.func,
  validations: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      test: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      args: PropTypes.array,
      validWhen: PropTypes.any,
      message: PropTypes.string.isRequired
    })
  )
}

export default FormValidation
