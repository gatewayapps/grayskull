import React from 'react'
import 'bootswatch/dist/materia/bootstrap.css'
import 'titatoggle/dist/titatoggle-dist-min.css'
import '../../public/global.css'

export default class extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}
