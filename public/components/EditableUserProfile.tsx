import * as React from 'react'
import ResponsiveStaticField from './ResponsiveStaticField'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
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
  modifiedState: object
  editing: boolean
  message: string
}

export default class EditableUserProfile extends React.Component<EditableUserProfileProps, EditableUserProfileState> {
  constructor(props: EditableUserProfileProps) {
    super(props)

    this.state = {
      modifiedState: {},
      editing: false,
      message: ''
    }
  }

  renderViewComponent() {
    return <div />
  }

  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const currentState = this.state.modifiedState
    currentState[e.currentTarget.name] = e.currentTarget.value
    this.setState({ modifiedState: currentState })
    console.log(currentState)
  }

  public render() {
    const finalUser = Object.assign(this.props.user, this.state.modifiedState)

    return (
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

          <ResponsiveValidatingInput onChange={this.handleChange} autoFocus label="Given Name" type="text" name="firstName" value={finalUser.firstName} readOnly={!this.state.editing} />

          <ResponsiveValidatingInput onChange={this.handleChange} label="Family Name" type="text" name="familyName" value={finalUser.lastName} readOnly={!this.state.editing} />

          <ResponsiveValidatingInput
            onChange={this.handleChange}
            label="Display Name"
            placeholder="Not Set"
            type="text"
            name="displayName"
            value={finalUser.displayName}
            readOnly={!this.state.editing}
          />

          <ResponsiveValidatingInput onChange={this.handleChange} label="Birthday" type="text" placeholder="Not Set" name="birthday" value={finalUser.birthday} readOnly={!this.state.editing} />

          <ResponsiveValidatingInput onChange={this.handleChange} label="Gender" placeholder="Not Set" type="text" name="gender" value={finalUser.gender} readOnly={!this.state.editing} />
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
                <Mutation mutation={UPDATE_USER_MUTATION} variables={this.state.modifiedState}>
                  {(updateUser: () => Promise<any>, { loading }) => {
                    return (
                      <button
                        disabled={loading}
                        onClick={async () => {
                          const result = await updateUser()
                          console.log(result)
                          const newState = {
                            editing: false,
                            message: result.update.message
                          }
                          this.setState(newState)
                        }}
                        className="btn btn-outline-success"
                        type="button">
                        {loading ? <i className="fal fa-fw fa-spin fa-spinner" /> : <i className="fal fa-fw fa-save" />} Save
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
                <i className="fa fa-fw fa-pencil" /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
}
