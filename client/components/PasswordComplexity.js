import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { hasLowercase, hasMinLength, hasNumber, hasSymbol, hasUppercase } from '../utils/passwordComplexity'

const PasswordComplexityList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
`

const CheckListItem = (props) => {
  const classes = `far fa-fw ${props.checked ? 'fa-check text-success' : 'fa-times text-danger'}`

  return (
    <li>
      <i className={classes} /> {props.label}
    </li>
  )
}

CheckListItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired
}

const PasswordComplexity = (props) => {
  const { configuration, password } = props

  return (
    <PasswordComplexityList>
      <CheckListItem
        checked={hasMinLength(password, configuration.passwordMinimumLength)}
        label={`Minimum length of ${configuration.passwordMinimumLength} characters`}
      />
      {configuration.passwordRequiresLowercase && (
        <CheckListItem checked={hasLowercase(password)} label="Contains lowercase letters (a-z)" />
      )}
      {configuration.passwordRequiresUppercase && (
        <CheckListItem checked={hasUppercase(password)} label="Contains uppercase letters (A-Z)" />
      )}
      {configuration.passwordRequiresNumber && (
        <CheckListItem checked={hasNumber(password)} label="Contains a number (0-9)" />
      )}
      {configuration.passwordRequiresSymbol && (
        <CheckListItem checked={hasSymbol(password)} label="Contains a symbol (!, #, @, etc...)" />
      )}
    </PasswordComplexityList>
  )
}

PasswordComplexity.propTypes = {
  configuration: PropTypes.shape({
    passwordMinimumLength: PropTypes.number.isRequired,
    passwordRequiresNumber: PropTypes.bool.isRequired,
    passwordRequiresSymbol: PropTypes.bool.isRequired,
    passwordRequiresLowercase: PropTypes.bool.isRequired,
    passwordRequiresUppercase: PropTypes.bool.isRequired
  }).isRequired,
  password: PropTypes.string.isRequired
}

export default PasswordComplexity
