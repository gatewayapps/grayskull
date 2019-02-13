import * as React from 'react'

import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import FormValidation, { FormValidationRule } from './FormValidation'
import moment from 'moment'

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION($firstName: String, $lastName: String, $displayName: String, $gender: String, $birthday: Date) {
    update(data: { firstName: $firstName, lastName: $lastName, displayName: $displayName, gender: $gender, birthday: $birthday }) {
      success
      message
    }
  }
`

export interface EditableUserProfileProps {
  user: {
    profileImageUrl: string | null | undefined
    firstName: string
    lastName: string
    displayName: string | null | undefined
    birthday: Date | null | undefined
    gender: string | null | undefined
  }
}

export interface EditableUserProfileState {
  modifiedState: any
  editing: boolean
  message: string
  valid: boolean
}

export default class EditableUserProfile extends React.Component<EditableUserProfileProps, EditableUserProfileState> {
  constructor(props: EditableUserProfileProps) {
    super(props)

    this.state = {
      modifiedState: {},
      editing: false,
      message: '',
      valid: false
    }
  }

  renderViewComponent() {
    return <div />
  }

  public handleChange = (e: { target: { name: string; value: any } }, validate: any) => {
    const currentState = this.state.modifiedState
    currentState[e.target.name] = e.target.value
    this.setState({ modifiedState: currentState })
    validate()
  }

  private onValidated = (isValid: boolean) => {
    this.setState({ valid: isValid })
  }

  public render() {
    const validDate = (d) => !d || moment(d).format('L') === d

    const finalUser = Object.assign(this.props.user, this.state.modifiedState)
    if (!this.state.modifiedState.birthday && this.props.user.birthday) {
      finalUser.birthday = moment(this.props.user.birthday).format('L')
    }
    const validations = [
      new FormValidationRule('firstName', 'isEmpty', false, 'Given name is required'),
      new FormValidationRule('lastName', 'isEmpty', false, 'Family name is required'),
      new FormValidationRule('birthday', validDate, true, 'Birthday must be in format MM/DD/YYYY')
    ]

    const genderOptions = ['Male', 'Female']
    if (finalUser.gender && genderOptions.includes(finalUser.gender) === false) {
      genderOptions.push(finalUser.gender)
    }

    return (
      <FormValidation validations={validations} data={finalUser} onValidated={this.onValidated}>
        {({ validate, validationErrors }) => (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile</h5>
              <ResponsiveValidatingInput
                label="Photo"
                type="photo"
                readOnly={!this.state.editing}
                name="profileImageUrl"
                value={finalUser.profileImageUrl || '/static/profile-default.jpg'}
                className="ml-auto float-right rounded-circle mr-4"
                style={{ height: '80px' }}
              />

              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                onChange={(e) => {
                  this.handleChange(e, validate)
                }}
                autoFocus
                label="Given Name"
                type="text"
                name="firstName"
                value={finalUser.firstName}
                readOnly={!this.state.editing}
              />

              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                onChange={(e) => {
                  this.handleChange(e, validate)
                }}
                label="Family Name"
                type="text"
                name="familyName"
                value={finalUser.lastName}
                readOnly={!this.state.editing}
              />

              <ResponsiveValidatingInput
                onChange={(e) => {
                  this.handleChange(e, validate)
                }}
                label="Display Name"
                validationErrors={validationErrors}
                placeholder="Not Set"
                type="text"
                name="displayName"
                value={finalUser.displayName}
                readOnly={!this.state.editing}
              />

              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                onChange={(e) => {
                  this.handleChange(e, validate)
                }}
                label="Birthday"
                type="date"
                name="birthday"
                value={finalUser.birthday}
                readOnly={!this.state.editing}
              />

              <ResponsiveValidatingInput
                onChange={(e) => {
                  this.handleChange(e, validate)
                }}
                label="Gender"
                type="select"
                allowCustom
                helpText="You can enter a custom gender here"
                options={genderOptions}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => option}
                name="gender"
                value={finalUser.gender}
                readOnly={!this.state.editing}
              />
              {this.state.message && <div className="alert alert-warning">{this.state.message}</div>}
            </div>
            <div className="card-footer w-100">
              <div className="btn-toolbar">
                {this.state.editing ? (
                  <div className="ml-auto">
                    <button
                      className="btn btn-secondary mr-2"
                      onClick={() => {
                        this.setState({ editing: false, modifiedState: {} })
                      }}>
                      <i className="fa fa-fw fa-times" /> Cancel
                    </button>
                    <Mutation mutation={UPDATE_USER_MUTATION}>
                      {(updateUser: (payload: any) => Promise<any>, { loading }) => {
                        return (
                          <button
                            disabled={loading || !this.state.valid}
                            onClick={async () => {
                              const payload = this.state.modifiedState
                              if (payload.birthday) {
                                payload.birthday = moment(payload.birthday, 'L').toDate()
                              }

                              console.log('sending payload', payload)
                              const result = await updateUser({ variables: payload })

                              const newState = {
                                editing: !result.data.update.success,
                                message: result.data.update.message,
                                modifiedState: this.state.modifiedState
                              }
                              if (!newState.editing) {
                                newState.modifiedState = {}
                              }
                              this.setState(newState)
                            }}
                            className="btn btn-outline-success"
                            type="button">
                            {loading ? <i className="fal fa-fw fa-spin fa-spinner" /> : <i className="fal fa-fw fa-save" />} Save Info
                          </button>
                        )
                      }}
                    </Mutation>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-info  ml-auto"
                    onClick={() => {
                      this.setState({ editing: true })
                    }}>
                    <i className="fa fa-fw fa-pencil" /> Edit Info
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </FormValidation>
    )
  }
}