import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import UserContext from '../contexts/UserContext'
import { generateRoutingState } from '../utils/routing'
import LoadingIndicator from './LoadingIndicator'

const GET_ME_QUERY = gql`
  query GET_ME_QUERY {
    me {
      firstName
      lastName
      profileImageUrl
      permissions
    }
  }
`

class RequireAuthentication extends Component {
  state = {
    initialized: false,
    user: undefined
  }

  async componentDidMount(setUser) {
    const { data } = await this.apolloClient.query({
      query: GET_ME_QUERY,
      fetchPolicy: 'network-only'
    })
    if (data && data.me) {
      this.setUser(data.me)
    } else {
      const state = generateRoutingState(this.props.router)
      this.setUser(undefined)
      window.location.replace(`/login?state=${state}`)
    }
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ user, setUser }) => (
          <ApolloConsumer>
            {(apolloClient) => {
              this.apolloClient = apolloClient
              this.setUser = setUser
              if (!user) {
                return <LoadingIndicator />
              }

              return this.props.children
            }}
          </ApolloConsumer>
        )}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(RequireAuthentication)
