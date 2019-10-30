import nodemailer, { SendMailOptions } from 'nodemailer'
import ConfigurationManager from '../../config/ConfigurationManager'
import { join, normalize } from 'path'
import handlebars from 'handlebars'
import { existsSync, readFileSync } from 'fs'

const TEMPLATE_PATH = '../../templates'

class MailService {
  public async sendMail(to: string, subject: string, textBody: string, htmlBody: string): Promise<any> {
    const mailConfig = ConfigurationManager.Mail!
    const transport = nodemailer.createTransport({
      host: mailConfig.serverAddress,
      port: mailConfig.port,
      secure: mailConfig.tlsSslRequired,
      auth: mailConfig.username
        ? {
            user: mailConfig.username,
            pass: mailConfig.password
          }
        : undefined
    })

    const messageOptions: SendMailOptions = {
      from: mailConfig.fromAddress,
      to: to,
      subject: subject,
      text: textBody,
      html: htmlBody
    }
    try {
      const mailResult = await transport.sendMail(messageOptions)
      return mailResult
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  public sendEmailTemplate(templateName: string, to: string, subject: string, context: object): Promise<any> {
    const textTemplateFileName = `${templateName}.text.handlebars`
    const htmlTemplateFileName = `${templateName}.html.handlebars`

    const textTemplatePath = normalize(join(__dirname, TEMPLATE_PATH, textTemplateFileName))
    const htmlTemplatePath = normalize(join(__dirname, TEMPLATE_PATH, htmlTemplateFileName))

    if (!existsSync(textTemplatePath) && !existsSync(htmlTemplatePath)) {
      throw new Error(`No template found in ${TEMPLATE_PATH} with name ${templateName} - looked for ${textTemplateFileName}, ${htmlTemplateFileName}`)
    }

    let textBody: string = ''
    let htmlBody: string = ''

    if (existsSync(textTemplatePath)) {
      textBody = this.processTemplateWithContext(textTemplatePath, context)
    }
    if (existsSync(htmlTemplatePath)) {
      htmlBody = this.processTemplateWithContext(htmlTemplatePath, context)
    }

    return this.sendMail(to, subject, textBody, htmlBody)
  }

  private processTemplateWithContext(templateFilePath: string, context: object): string {
    if (!existsSync(templateFilePath)) {
      throw new Error(`File not found: ${templateFilePath}`)
    }

    const templateContents = readFileSync(templateFilePath, 'utf8')
    const templateFunction = handlebars.compile(templateContents)
    return templateFunction(context)
  }
}

export default new MailService()
