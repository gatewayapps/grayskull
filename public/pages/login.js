import Primary from '../layouts/primary'

const login = (props, ownProps) => (
  <Primary>
    <div>
      <p>Hello Next.js {props.data.name}</p>
      
      <div className='container'>
        <div className='card'>
        <div className='card-body'>
{props.error && <div className='alert alert-danger'>{props.error.message}</div>}
      <form method='post' className='form'>
        <input type='text' name='name' defaultValue={props.data.name} />
        <button type='submit'>submit</button>
      </form>
      </div>
      </div>
      </div>
      
    </div>
  </Primary>
)

login.getInitialProps = async ({ req, query, res }) => {
  return { data: req.body, query, ...res.locals }
}

export default login