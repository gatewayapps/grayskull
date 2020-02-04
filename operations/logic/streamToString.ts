import { Stream } from 'stream'

export async function streamToString(stream: Stream) {
  const chunks: Uint8Array[] = []
  return new Promise<string>((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}
