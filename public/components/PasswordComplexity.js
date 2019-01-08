import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {
  hasLowercase,
  hasMinLength,
  hasNumber,
  hasSymbol,
  hasUppercase,
} from '../utils/passwordComplexity'

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
  label: PropTypes.string.isRequired,
}

const PasswordComplexity = (props) => {
  const { configuration, password } = props

  return (
    <PasswordComplexityList>
      <CheckListItem
        checked={hasMinLength(password, configuration.passwordMinimumLength)}
        label={`Minimum length of ${configuration.passwordMinimumLength} characters`}
      />
      {configuration.passwordRequireLowercase && (
        <CheckListItem
          checked={hasLowercase(password)}
          label='Contains lowercase letters (a-z)'
        />
      )}
      {configuration.passwordRequireUppercase && (
        <CheckListItem
          checked={hasUppercase(password)}
          label='Contains uppercase letters (A-Z)'
        />
      )}
      {configuration.passwordRequireNumber && (
        <CheckListItem
          checked={hasNumber(password)}
          label='Contains a number (0-9)'
        />
      )}
      {configuration.passwordRequireSymbol && (
        <CheckListItem
          checked={hasSymbol(password)}
          label='Contains a symbol (!, #, @, etc...)'
        />
      )}
    </PasswordComplexityList>
  )
}

PasswordComplexity.propTypes = {
  configuration: PropTypes.shape({
    passwordMinimumLength: PropTypes.number.isRequired,
    passwordRequireNumber: PropTypes.bool.isRequired,
    passwordRequireSymbol: PropTypes.bool.isRequired,
    passwordRequireLowercase: PropTypes.bool.isRequired,
    passwordRequireUppercase: PropTypes.bool.isRequired,
  }).isRequired,
  password: PropTypes.string.isRequired,
}

export default PasswordComplexity
