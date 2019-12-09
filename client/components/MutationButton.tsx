import * as React from 'react'
import { Mutation, MutationFunction, OperationVariables, MutationResult } from 'react-apollo'

export interface MutationButtonProps {
  mutation: any
  variables: any
  className: any
  onSuccess?: any
  onFail?: any
  busyContent: any
  disabled?: boolean
  content: any
}

class MutationButton extends React.Component<MutationButtonProps, any> {
  public render() {
    return (
      <Mutation mutation={this.props.mutation} variables={this.props.variables}>
        {(MutationFunction: MutationFunction<any, OperationVariables>, result: MutationResult<any>) => (
          <button
            disabled={this.props.disabled || result.loading}
            className={this.props.className}
            onClick={async () => {
              try {
                const result = await MutationFunction()
                if (this.props.onSuccess) {
                  this.props.onSuccess(result)
                }
              } catch (err) {
                if (this.props.onFail) {
                  this.props.onFail(err)
                }
              }
            }}>
            {result.loading ? this.props.busyContent : this.props.content}
          </button>
        )}
      </Mutation>
    )
  }
}
export default MutationButton
