import config from 'config'
import email from 'emailjs'

const server = email.server.connect(config.get('Mail'))

class MailService {
  public sendMail(to: string, subject: string, body: string, from: string): Promise<object> {
    return new Promise((resolve, reject) => {
      server.send(
        {
          to,
          from,
          subject,
          text: body
        },
        (err, msg) => {
          if (err) {
            return reject(err)
          } else {
            return resolve(msg)
          }
        }
      )
    })
  }
}

export default new MailService()
