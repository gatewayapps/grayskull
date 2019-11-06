import React from 'react'
import RequireConfiguration from './RequireConfiguration'
import styled from 'styled-components'

import { IConfiguration } from '../../server/data/models/IConfiguration'

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
  <RequireConfiguration>
    {(configuration: IConfiguration) => {
      const backgroundImageUrl = configuration.Server && configuration.Server.realmBackground ? configuration.Server.realmBackground : '/bg.jpg'
      const backgroundImageValue = backgroundImageUrl === 'none' ? undefined : `url(${backgroundImageUrl})`

      return <BackgroundCover style={{ backgroundImage: backgroundImageValue }}>{props.children}</BackgroundCover>
    }}
  </RequireConfiguration>
)

export default BackgroundCoverComponent
