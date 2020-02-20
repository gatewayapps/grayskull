import { AdaptiveInputProps } from './index'
import ImageDropArea from '../ImageDropArea'

export const PhotoInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
  if (props.readOnly) {
    return <img className="d-block" style={{ height: '150px' }} src={props.value} />
  } else {
    const finalProps = { ...props, style: undefined, className: undefined }

    return (
      <ImageDropArea
        {...finalProps}
        style={{ height: '150px', maxWidth: '400px', padding: '2px', border: '1px black dashed' }}
        src={props.value}
        onUploadComplete={(file) => {
          props.onChange({ target: { name: props.name, value: file.url } })
        }}
      />
    )
  }
}
