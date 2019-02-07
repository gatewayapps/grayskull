import cn from 'classnames'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'

const MAX_FILE_SIZE = 10000000

export interface IUploadedFile {
  url: string
  mimetype: string
  size: number
}

export type OnUploadCompleteFn = (uploadedFile: IUploadedFile) => void
export type OnUploadRejectedFn = (rejectedFiles: File[]) => void

export interface IFileDropAreaProps {
  className?: string
  imagesOnly?: boolean
  onUploadComplete: OnUploadCompleteFn
  onUploadFailed?: (error: Error) => void
  onUploadRejected?: OnUploadRejectedFn
  style?: React.CSSProperties
}

const DropArea = styled.div`
  border: 2px dashed #000;
  border-radius: 1rem;
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

export default class FileDropArea extends React.PureComponent<IFileDropAreaProps, any> {
  onDrop = async (acceptedFiles: File[], rejectedFiles: File[], uploadFile: MutationFn) => {
    if (rejectedFiles.length > 0 && this.props.onUploadRejected) {
      this.props.onUploadRejected(rejectedFiles)
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
      if (this.props.onUploadFailed) {
        this.props.onUploadFailed(err)
      }
    }
  }

  public render() {
    const { className, imagesOnly, style } = this.props

    return (
      <Mutation mutation={UPLOAD_FILE_MUTATION}>
        {(uploadFile) => (
          <Dropzone accept={imagesOnly ? 'image/*' : undefined} maxSize={MAX_FILE_SIZE} onDrop={(accepted, rejected) => this.onDrop(accepted, rejected, uploadFile)}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
              const dropAreaClasses = cn(className, {
                active: isDragActive,
                reject: isDragReject
              })

              return (
                <DropArea {...getRootProps()} className={dropAreaClasses} style={style}>
                  <input {...getInputProps()} />
                  {this.props.children}
                </DropArea>
              )
            }}
          </Dropzone>
        )}
      </Mutation>
    )
  }
}
