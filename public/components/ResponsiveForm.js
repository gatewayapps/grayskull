import styled from 'styled-components'
import PropTypes from 'prop-types'

class ResponsiveForm extends React.Component {
  static propTypes = {
    formHeader: PropTypes.any,
    formBody: PropTypes.any,
    formFooter: PropTypes.any
  }

  render = () => {
    return (
      <div className={`${this.props.className} card`}>
        <div className="card-header">
          <h5 className=" card-title m-0">{this.props.formHeader}</h5>
        </div>
        <div className="card-body pb-4">
          {this.props.formBody}
          <div style={{ height: '100px' }} />
        </div>
        <div className="card-footer">{this.props.formFooter}</div>
      </div>
    )
  }
}

export default styled(ResponsiveForm)`
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0px !important;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    .card-header {
      .header-logo {
        width: 48px;
      }
    }
  }

  .card-body {
    flex: 1;
    overflow-y: auto;
  }
`
