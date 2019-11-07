import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import UserContext from '../contexts/UserContext'
import { generateRoutingState } from '../utils/routing'
import LoadingIndicator from './LoadingIndicator'
import Primary from '../layouts/primary'
import BackgroundCoverComponent from './BackgroundCover'

const GET_ME_QUERY = gql`
  query GET_ME_QUERY {
    me {
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
    }
  }
`

class RequireAuthentication extends Component {
  state = {
    initialized: false,
    user: undefined
  }

  componentDidMount() {
    this.fetchUserData()
  }

  fetchUserData = async () => {
    try {
      const { data } = await this.apolloClient.query({
        query: GET_ME_QUERY,
        fetchPolicy: 'network-only'
      })
      if (data && data.me) {
        this.setUser(data.me)
        this.setRefresh(this.fetchUserData)
      } else {
        const state = generateRoutingState(this.props.router)
        this.setUser(undefined)
        window.location.replace(`/login?state=${state}`)
      }
    } catch (err) {
      const state = generateRoutingState(this.props.router)
      this.setUser(undefined)
      window.location.replace(`/login?state=${state}`)
    }
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ user, setUser, setRefresh }) => {
          return (
            <ApolloConsumer>
              {(apolloClient) => {
                this.apolloClient = apolloClient
                this.setUser = setUser
                this.setRefresh = setRefresh
                if (!user) {
                  return (
                    <Primary>
                      <BackgroundCoverComponent>
                        <div className="alert alert-default">
                          <h4>
                            <LoadingIndicator message="Loading..." />
                          </h4>
                        </div>
                      </BackgroundCoverComponent>
                    </Primary>
                  )
                }

                return this.props.children
              }}
            </ApolloConsumer>
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(RequireAuthentication)
