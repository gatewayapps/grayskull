import Header from '../components/Header'
//import './theme.css'
import 'bootstrap/scss/bootstrap.scss'
import Head from 'next/head'

export default class extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
