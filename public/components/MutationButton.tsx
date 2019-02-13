import * as React from 'react'
import { Mutation, MutationFn, OperationVariables, MutationResult } from 'react-apollo'

export interface IAppProps {
  mutation: any
  variables: any
  className: any
  onSuccess: any
  onFail: any
  busyContent: any
  disabled: boolean
  content: any
}

export default class IApp extends React.Component<IAppProps, any> {
  public render() {
    return (
      <Mutation mutation={this.props.mutation} variables={this.props.variables}>
        {(mutationFn: MutationFn<any, OperationVariables>, result: MutationResult<any>) => (
          <button
            disabled={this.props.disabled || result.loading}
            className={this.props.className}
            onClick={async () => {
              try {
                const result = await mutationFn()
                this.props.onSuccess(result)
              } catch (err) {
                this.props.onFail(err)
              }
            }}>
            {result.loading ? this.props.busyContent : this.props.content}
          </button>
        )}
      </Mutation>
    )
  }
}
