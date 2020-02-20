import { AdaptiveInputProps } from './index'
import { default as Select, Creatable } from 'react-select'

export const SelectInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
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
