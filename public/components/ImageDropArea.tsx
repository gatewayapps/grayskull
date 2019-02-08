import cn from 'classnames'
import gql from 'graphql-tag'
import prettyBytes from 'pretty-bytes'
import * as React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'

const MAX_FILE_SIZE = 10000000 // 10MB

export interface IUploadedFile {
  url: string
  mimetype: string
  size: number
}

export type OnUploadCompleteFn = (uploadedFile: IUploadedFile) => void

export interface IImageDropAreaProps {
  'aria-describedby': string
  className?: string
  disabled?: boolean
  onUploadComplete: OnUploadCompleteFn
  onUploadFailed?: (error: Error) => void
  style?: React.CSSProperties
  value: string
}

const DropArea = styled.div`
  border: 2px dashed transparent;
  cursor: pointer;

  &.empty {
    border-color: #666;
    border-color: var(--gray);
    border-radius: 1rem;
  }

  &.is-invalid {
    border-color: #e51c23;
    border-color: var(--danger);
  }

  &.active {
    border-color: #222;
    border-color: var(--gray-dark);
  }
`

const UPLOAD_FILE_MUTATION = gql`
  mutation UPLOAD_FILE_MUTATION($file: Upload!) {
    uploadFile(file: $file) {
      url
      mimetype
      size
    }
  }
`

export default class ImageDropArea extends React.PureComponent<IImageDropAreaProps, any> {
  onDrop = async (acceptedFiles: File[], rejectedFiles: File[], uploadFile: MutationFn) => {
    if (rejectedFiles.length > 0) {
      const file = rejectedFiles[0]
      let message: string
      if (!/^image\//.test(file.type)) {
        message = `The file type for "${file.name}" is not supported. Please choose an image and try again.`
      } else if (file.size > MAX_FILE_SIZE) {
        message = `The file "${file.name}" with a size of ${prettyBytes(file.size)} is too large to upload. The maximum upload file size is ${prettyBytes(MAX_FILE_SIZE)}.`
      } else {
        message = `The file "${file.name}" could not be uploaded.`
      }
      window.alert(message)
      return
    }
    if (acceptedFiles.length === 0) {
      return
    }
    try {
      const result = await uploadFile({ variables: { file: acceptedFiles[0] } })
      if (result && result.data && result.data.uploadFile) {
        this.props.onUploadComplete(result.data.uploadFile)
      }
    } catch (err) {
      console.error(err)
      if (this.props.onUploadFailed) {
        this.props.onUploadFailed(err)
      }
    }
  }

  public render() {
    return (
      <Mutation mutation={UPLOAD_FILE_MUTATION}>
        {(uploadFile) => (
          <Dropzone accept="image/*" disabled={this.props.disabled} maxSize={MAX_FILE_SIZE} onDrop={(accepted, rejected) => this.onDrop(accepted, rejected, uploadFile)}>
            {({ getRootProps, getInputProps, isDragActive }) => {
              const dropAreaClasses = cn(this.props.className, {
                active: isDragActive,
                empty: !this.props.value
              })

              return (
                <DropArea {...getRootProps()} className={dropAreaClasses} style={this.props.style}>
                  <input {...getInputProps()} aria-describedBy={this.props['aria-describedby']} />
                  {this.props.value ? <img src={this.props.value} style={{ maxHeight: '100%', maxWidth: '100%' }} /> : this.props.children}
                </DropArea>
              )
            }}
          </Dropzone>
        )}
      </Mutation>
    )
  }
}
