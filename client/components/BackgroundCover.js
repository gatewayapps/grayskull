import styled from 'styled-components'

const BackgroundCover = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: url('/bg.jpg');
  overflow-y: auto;
  padding: 1rem;

  .container {
    margin-left: 0;
    margin-right: 0;
  }
`

export default BackgroundCover
