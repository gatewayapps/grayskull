const Test = (props) => (
  <div>
    Hello from the test page {props.user.firstName}!
  </div>
)

Test.getInitialProps = async ({ query, res }) => {
  return { query, ...res.locals }
}

export default Test
