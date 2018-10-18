import ConfigurationManager from '@/config/ConfigurationManager'
import email from 'emailjs'

const server = email.server.connect(ConfigurationManager.Mail)

class MailService {
  public sendMail(to: string, subject: string, body: string, from: string): Promise<object> {
    return new Promise((resolve, reject) => {
      server.send(
        {
          to,
          from,
          subject,
          text: body,
          attachment: [{ data: `<html><body>${body.replace(/\n/g, '<br />')}</body></html>`, alternative: true }]
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
