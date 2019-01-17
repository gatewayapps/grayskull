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
    user: undefined,
  }

  async componentDidMount() {
    const { data } = await this.apolloClient.query({
      query: GET_ME_QUERY,
      fetchPolicy: 'network-only'
    })
    if (data && data.me) {
      this.setState({
        initialized: true,
        user: data.me
      })
    } else {
      const state = generateRoutingState(this.props.router)
      window.location.replace(`/login?state=${state}`)
    }
  }

  render() {
    return (
      <ApolloConsumer>
        {(apolloClient) => {
          this.apolloClient = apolloClient
          if (!this.state.initialized) {
            return (<LoadingIndicator />)
          }
          return (
            <UserContext.Provider value={{ user: this.state.user }}>
              {this.props.children}
            </UserContext.Provider>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export default withRouter(RequireAuthentication)
