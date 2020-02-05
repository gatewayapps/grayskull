import React from 'react'

import Cleave from 'cleave.js/react'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import ImageDropArea from './ImageDropArea'

export interface AdaptiveInputProps {
  type: string
  className: string | undefined
  onChange: ({ target: { name: string, value: any } }) => void
}

export default class AdaptiveInput extends React.Component<AdaptiveInputProps, any> {
  public render() {
    const { className, ...props } = this.props
    switch (props.type) {
      case 'text':
      case 'email':
      case 'number':
        return this.renderTextInput(props, className)
      case 'masked':
        return this.renderMaskedInput(props, className)
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

  private renderPhotoInput = (props: any) => {
    if (props.readOnly) {
      return <img className="d-block" style={{ height: '150px' }} src={props.value} />
    } else {
      const { style, className, ...restProps } = props

      delete style
      delete className
      return (
        <ImageDropArea
          {...restProps}
          style={{ height: '150px', maxWidth: '400px', padding: '2px', border: '1px black dashed' }}
          src={props.value}
          onUploadComplete={(file) => {
            this.props.onChange({ target: { name: props.name, value: file.url } })
          }}
        />
      )
    }
  }

  private renderTextInput = (props: any, className: string | undefined) => (
    <input className={`form-control ${className || ''}`} {...props} value={props.value || undefined} />
  )

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
    return (
      <Cleave
        {...props}
        onChange={(e) => {
          this.props.onChange({ target: { name: props.name, value: e.target.value } })
        }}
        options={{ blocks: [2, 2, 4], delimiter: '/' }}
        placeholder={'MM/DD/YYYY'}
        type={undefined}
        value={props.value || ''}
        className={`form-control ${className || ''}`}
      />
    )
  }

  private renderMaskedInput = (props: any, className: string | undefined) => {
    delete props.type
    return (
      <Cleave
        {...props}
        className={`form-control ${className || ''}`}
        value={props.value || ''}
        onChange={(e) => {
          this.props.onChange({ target: { name: props.name, value: e.target.rawValue } })
        }}
      />
    )
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
      return this.renderTextInput(
        { name: props.name, defaultValue: props.value, readOnly: true, placeholder: 'Gender' },
        className
      )
    }
    const { options, allowCustom, ...finalProps } = props

    if (allowCustom) {
      return (
        <Creatable
          {...finalProps}
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
          {...finalProps}
          placeholder={props.value || props.placeholder}
          onChange={(e: any) => {
            props.onChange({ target: { name: props.name, value: e } })
          }}
        />
      )
    }
  }
}
