import React from 'react'
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
	onMutationStart?: () => void
	onMutationEnd?: () => void
}

class MutationButton extends React.Component<MutationButtonProps, any> {
	public render() {
		return (
			<Mutation mutation={this.props.mutation} variables={this.props.variables}>
				{(mutation: MutationFunction<any, OperationVariables>, result: MutationResult<any>) => (
					<button
						disabled={this.props.disabled || result.loading}
						className={this.props.className}
						onClick={async () => {
							if (this.props.onMutationStart) {
								this.props.onMutationStart()
							}
							try {
								const result = await mutation()
								if (this.props.onSuccess) {
									this.props.onSuccess(result)
								}
							} catch (err) {
								if (this.props.onFail) {
									this.props.onFail(err)
								}
							} finally {
								if (this.props.onMutationEnd) {
									this.props.onMutationEnd()
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
