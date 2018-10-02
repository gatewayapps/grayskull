import Header from '../components/Header'
import './theme.css'
import Head from 'next/head'

export default class extends React.Component {

  render(){
    return (<div className='jumbotron'>
      <Header />
      {this.props.children}
  </div>)
  }
}


