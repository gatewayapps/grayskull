import nodemailer, { SendMailOptions, TransportOptions } from 'nodemailer'

import { join, normalize } from 'path'
import handlebars from 'handlebars'
import { existsSync, readFileSync } from 'fs'
import { getCurrentConfiguration } from '../../config/ConfigurationManager'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const TEMPLATE_PATH = './server/templates'

class MailService {
  public async sendMail(to: string, subject: string, textBody: string, htmlBody: string): Promise<any> {
    const config = await getCurrentConfiguration(false)
    const mailConfig = config.Mail!
    const hostAddress = mailConfig.serverAddress!

    const options: any = {
      host: hostAddress,
      port: mailConfig.port,
      secure: mailConfig.tlsSslRequired,
      auth: mailConfig.username
        ? {
            user: mailConfig.username,
            pass: mailConfig.password
          }
        : undefined
    }

    const transport = nodemailer.createTransport(options)

    const messageOptions: SendMailOptions = {
      from: mailConfig.fromAddress!,
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

    const textTemplatePath = normalize(join(serverRuntimeConfig.PROJECT_ROOT, TEMPLATE_PATH, textTemplateFileName))
    const htmlTemplatePath = normalize(join(serverRuntimeConfig.PROJECT_ROOT, TEMPLATE_PATH, htmlTemplateFileName))

    if (!existsSync(textTemplatePath) && !existsSync(htmlTemplatePath)) {
      throw new Error(`No template found in ${TEMPLATE_PATH} with name ${templateName} - looked for ${textTemplateFileName}, ${htmlTemplateFileName}`)
    }

    let textBody = ''
    let htmlBody = ''

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
