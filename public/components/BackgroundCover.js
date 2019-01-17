import styled from 'styled-components'

const BackgroundCover = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: url('/static/bg.jpg');
  overflow-y: auto;
  padding: 1rem;
`

export default BackgroundCover
