import { ReadStream } from 'fs'

export type FileUpload = Promise<{
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => ReadStream
}>
