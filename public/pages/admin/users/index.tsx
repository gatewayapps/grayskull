import gql from 'graphql-tag'

import React from 'react'
import { Query } from 'react-apollo'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import moment from 'moment'
import ErrorMessage from '../../../components/ErrorMessage'
import LoadingIndicator from '../../../components/LoadingIndicator'
import AuthenticatedRoute from '../../../layouts/authenticatedRoute'
import Permissions from '../../../utils/permissions'
import { RequirePermission, RequirePermissionModes } from '../../../components/RequirePermission'
import EditableUserProfile from '../../../components/EditableUserProfile'
import CSVDataImport from '../../../components/CSVDataImport'

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    userAccounts {
      userAccountId
      firstName
      lastName
      displayName
      birthday
      gender
      profileImageUrl
      permissions
      lastPasswordChange
      emailAddress
      otpEnabled
      lastActive
    }
  }
`

export interface UsersIndexPageProps {}

export interface UsersIndexPageState {
  editingUser: any
  importingUser: any
}

class UsersIndexPage extends React.Component<UsersIndexPageProps, UsersIndexPageState> {
  constructor(props: UsersIndexPageProps) {
    super(props)

    this.state = {
      editingUser: undefined,
      importingUser: undefined
    }
  }

  public render() {
    return (
      <AuthenticatedRoute permission={Permissions.ADMIN}>
        <div className="container pt-4">
          <div className="row mb-2">
            <div className="col">
              <h1>Users</h1>
            </div>
            <div className="col-auto">
              <RequirePermission mode={RequirePermissionModes.SHOW_ERROR} permission={Permissions.ADMIN}>
                <button
                  style={{ marginRight: '20px' }}
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => {
                    this.setState({
                      importingUser: {
                        permissions: Permissions.USER
                      }
                    })
                  }}>
                  <i className="fal fa-plus" /> Import Users
                </button>
              </RequirePermission>
              <RequirePermission mode={RequirePermissionModes.SHOW_ERROR} permission={Permissions.ADMIN}>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => {
                    this.setState({
                      editingUser: {
                        firstName: '',
                        lastName: '',
                        emailAddress: '',
                        permissions: Permissions.USER
                      }
                    })
                  }}>
                  <i className="fal fa-plus" /> Add User
                </button>
              </RequirePermission>
            </div>
          </div>
          <Query query={ALL_USERS_QUERY}>
            {({ data, error, loading, refetch }) => {
              if (loading) {
                return <LoadingIndicator />
              }
              if (error) {
                return <ErrorMessage error={error} />
              }
              if (!data || !Array.isArray(data.userAccounts)) {
                return <p>No Users found</p>
              }
              return (
                <div>
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Family Name</th>
                        <th>Given Name</th>
                        <th>Display Name</th>
                        <th>Email Address</th>
                        <th>Last Active</th>
                        <th> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.userAccounts.map((user) => (
                        <tr key={user.userAccountId}>
                          <td>{user.lastName}</td>
                          <td>{user.firstName}</td>
                          <td>{user.displayName || ''}</td>
                          <td>{user.emailAddress}</td>
                          <td>{moment(user.lastActive).fromNow()}</td>
                          <td>
                            <div className="w-100 d-flex">
                              <div className="btn-toolbar ml-auto">
                                <button
                                  title="Edit User"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    this.setState({ editingUser: user })
                                  }}>
                                  <i className="fa fa-fw fa-edit" /> Edit
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {this.state.editingUser && (
                    <Modal
                      isOpen
                      size="lg"
                      toggle={() => {
                        this.setState({ editingUser: undefined })
                      }}>
                      <ModalBody>
                        <EditableUserProfile
                          onCancel={() => {
                            this.setState({ editingUser: undefined })
                          }}
                          onSave={() => {
                            this.setState({ editingUser: false })
                            refetch()
                          }}
                          isEditing
                          showPermissionSelector
                          user={this.state.editingUser}
                        />
                      </ModalBody>
                    </Modal>
                  )}
                  {this.state.importingUser && (
                    <Modal
                      isOpen
                      size="lg"
                      toggle={() => {
                        this.setState({ importingUser: undefined })
                      }}>
                      <ModalBody>
                        <CSVDataImport
                          onCancel={() => {
                            this.setState({ importingUser: undefined })
                          }}
                          onSave={() => {
                            this.setState({ importingUser: false })
                            refetch()
                          }}
                          isImporting
                          showPermissionSelector
                          user={this.state.importingUser}
                        />
                      </ModalBody>
                    </Modal>
                  )}
                </div>
              )
            }}
          </Query>
        </div>
      </AuthenticatedRoute>
    )
  }
}

export default UsersIndexPage
export { ALL_USERS_QUERY }
