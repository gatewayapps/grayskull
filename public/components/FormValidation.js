import debounce from 'lodash/debounce'
import React, { PureComponent } from 'react'
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

class FormValidation extends PureComponent {
  state = {
    isValid: false,
    validationErrors: {},
    validating: false,
  }

  componentDidMount() {
    if (this.props.data) {
      this.onValidate(this.props.data)
    }
  }

  onValidate = debounce(async (data) => {
    if (!Array.isArray(this.props.validations) || this.props.validations.length === 0) {
      this.setState({
        validationErrors: {},
        isValid: true,
        validating: false,
      })
    }

    this.setState({ validating: true })

    data = data || this.props.data

    const validationErrors = {}

    for (let i = 0; i < this.props.validations.length; i++) {
      const rule = this.props.validations[i]
      const testFn = typeof rule.test === 'string' ? Validator[rule.test] : rule.test
      if (typeof testFn === 'function') {
        const value = data[rule.field]
        const args = rule.args || []
        const validWhen = rule.validWhen || false
        if (await testFn(value, ...args) !== validWhen) {
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
      validating: false,
    })

    if (this.props.onValidated) {
      this.props.onValidated(isValid, validationErrors)
    }
  }, 300)

  render() {
    return this.props.children({
      validationErrors: this.state.validationErrors,
      isValid: this.state.isValid,
      validate: this.onValidate,
    })
  }
}

FormValidation.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.any,
  onValidated: PropTypes.func,
  validations: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string.isRequired,
    test: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    args: PropTypes.array,
    validWhen: PropTypes.any,
    message: PropTypes.string.isRequired,
  })),
}

export default FormValidation
