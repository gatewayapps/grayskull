import * as React from 'react'

export interface ResponsiveStaticFieldProps {
  label: string
  value: string | Date | number
  labelColumnWidth: number
}

export default class ResponsiveStaticField extends React.Component<ResponsiveStaticFieldProps> {
  static defaultProps: ResponsiveStaticFieldProps = {
    labelColumnWidth: 3,
    label: '',
    value: ''
  }

  constructor(props: ResponsiveStaticFieldProps) {
    super(props)
  }

  public render() {
    const valueColumnWidth = 12 - this.props.labelColumnWidth
    let renderedValue = this.props.value
    if (renderedValue instanceof Date) {
      renderedValue = renderedValue.toLocaleDateString()
    }
    return (
      <div className="row align-items-center">
        <div style={{ fontSize: '.6875rem' }} className={`d-none d-md-block text-uppercase text-muted col-md-${this.props.labelColumnWidth}`}>
          {this.props.label}
        </div>
        <div className={`col-12 col-md-${valueColumnWidth}`}>
          <div className="d-block d-md-none  text-muted text-uppercase" style={{ fontSize: '.6875rem' }}>
            {this.props.label}
          </div>
          <div style={{ fontSize: '1.2rem' }}>{this.props.value || <span className="font-italic text-muted font-weight-light">Not Set</span>}</div>
        </div>
      </div>
    )
  }
}
