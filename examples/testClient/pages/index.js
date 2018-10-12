const Home = (props) => (
  <div>
    Hello {props.user.firstName} {props.user.lastName}
  </div>
)

Home.getInitialProps = async ({ query, res }) => {
  return { query, ...res.locals }
}

export default Home
