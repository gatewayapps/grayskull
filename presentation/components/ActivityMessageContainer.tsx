import React from 'react'
import styled from 'styled-components'
const ActivityMessageContainer = styled.div`
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

const ActivityMessageContainerComponent = (props) => (
  <ActivityMessageContainer>
    <div className="card" style={{ minWidth: '480px' }}>
      <div className="card-body">{props.children}</div>
    </div>
  </ActivityMessageContainer>
)

export default ActivityMessageContainerComponent
