import email from 'emailjs'
import ConfigurationManager from '@/config/ConfigurationManager'

const server = email.server.connect(ConfigurationManager.Mail)

class MailService {
  public sendMail(to: string, subject: string, body: string): Promise<object> {
    return new Promise((resolve, reject) => {
      server.send(
        {
          to,
          from: ConfigurationManager.Mail!.fromAddress,
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
