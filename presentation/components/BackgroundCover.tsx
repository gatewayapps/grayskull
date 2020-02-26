import React from 'react'

import styled from 'styled-components'

import ConfigurationContext from '../contexts/ConfigurationContext'

const BackgroundCover = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-size: cover;
	background-position: center;

	overflow-y: auto;
	padding: 0.5rem;

	.container {
		margin-left: 0;
		margin-right: 0;
	}
`

const BackgroundCoverComponent = (props) => (
	<ConfigurationContext.Consumer>
		{(configuration) => {
			const backgroundImageUrl =
				configuration && configuration.Server && configuration.Server.realmBackground
					? configuration.Server.realmBackground
					: '/bg.jpg'
			const backgroundImageValue = backgroundImageUrl === 'none' ? undefined : `url(${backgroundImageUrl})`

			return <BackgroundCover style={{ backgroundImage: backgroundImageValue }}>{props.children}</BackgroundCover>
		}}
	</ConfigurationContext.Consumer>
)

export default BackgroundCoverComponent
