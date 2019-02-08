import * as React from 'react'
import InputMask from 'react-input-mask'
import moment from 'moment'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'

export interface AdaptiveInputProps {
  type: string
  className: string | undefined
  onChange: (
    {
      target: { name: string, value: any }
    }
  ) => void
}

export default class AdaptiveInput extends React.Component<AdaptiveInputProps, any> {
  public render() {
    const { className, ...props } = this.props
    switch (props.type) {
      case 'text':
      case 'email':
      case 'number':
        return this.renderTextInput(props, className)
      case 'textarea':
        return this.renderTextAreaInput(props, className)
      case 'date':
        return this.renderDateInput(props, className)
      case 'checkbox':
        return this.renderCheckboxInput(props, className)
      case 'select':
        return this.renderSelectInput(props, className)
      case 'photo':
        return this.renderPhotoInput(props, className)
      default:
        return this.renderTextInput(props, className)
    }
  }

  private renderPhotoInput = (props: any, className: string | undefined) => <img className={className} {...props} src={props.value} />

  private renderTextInput = (props: object, className: string | undefined) => <input className={`form-control ${className || ''}`} {...props} />

  private renderTextAreaInput = (props: object, className: string | undefined) => (
    <textarea
      style={{
        whiteSpace: 'pre',
        overflowWrap: 'normal',
        overflowX: 'scroll',
        fontSize: '8pt'
      }}
      className={`form-control ${className || ''}`}
      {...props}
    />
  )

  private renderDateInput = (props: any, className: string | undefined) => {
    delete props.type
    return <InputMask {...props} maskChar=" " placeholder="MM/DD/YYYY" mask="99/99/9999" className={`form-control ${className || ''}`} />
  }

  private renderCheckboxInput = (props: object, className: string | undefined) => (
    <div className="form-check checkbox-slider-md checkbox-slider--b nofocus">
      <label className="m-0">
        <input {...props} className={`${className || 'nofocus'}`} style={{ fontSize: '1.15rem', paddingBottom: 0 }} />
        <span className="nofocus" />
      </label>
    </div>
  )

  private renderSelectInput = (props: any, className: string | undefined) => {
    if (props.readOnly) {
      return this.renderTextInput(props, className)
    }
    const { options, allowCustom, ...finalProps } = props
    if (allowCustom) {
      return (
        <Creatable
          {...props}
          onChange={(e: any) => {
            props.onChange({ target: { name: props.name, value: e } })
          }}
          placeholder={props.value || props.placeholder}
          getNewOptionData={(option) => option}
          options={options}
          className={`form-control ${className}`}
        />
      )
    } else {
      return (
        <Select
          options={options}
          className={`form-control ${className}`}
          {...props}
          placeholder={props.value || props.placeholder}
          onChange={(e: any) => {
            props.onChange({ target: { name: props.name, value: e } })
          }}
        />
      )
    }
  }
}
