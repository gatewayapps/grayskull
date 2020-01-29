import nodemailer, { SendMailOptions } from 'nodemailer'
import sgMail from '@sendgrid/mail'
import handlebars from 'handlebars'

import { decrypt } from '../../../operations/logic/encryption'
import { IConfiguration } from '../../../foundation/types/types'

const activateAccountHtmlTemplate = require('../../templates/activateAccountTemplate.html.handlebars').default
const activateAccountTextTemplate = require('../../templates/activateAccountTemplate.text.handlebars').default

const backupCodeHtmlTemplate = require('../../templates/backupCodeTemplate.html.handlebars').default
const backupCodeTextTemplate = require('../../templates/backupCodeTemplate.text.handlebars').default

const resetPasswordHtmlTemplate = require('../../templates/resetPasswordTemplate.html.handlebars').default
const resetPasswordTextTemplate = require('../../templates/resetPasswordTemplate.text.handlebars').default

const verifyEmailHtmlTemplate = require('../../templates/verifyEmailTemplate.html.handlebars').default
const verifyEmailTextTemplate = require('../../templates/verifyEmailTemplate.text.handlebars').default

const KNOWN_TEMPLATES = {
  activateAccountTemplate: {
    html: activateAccountHtmlTemplate,
    text: activateAccountTextTemplate
  },
  backupCodeTemplate: {
    html: backupCodeHtmlTemplate,
    text: backupCodeTextTemplate
  },
  resetPasswordTemplate: {
    html: resetPasswordHtmlTemplate,
    text: resetPasswordTextTemplate
  },
  verifyEmailTemplate: {
    html: verifyEmailHtmlTemplate,
    text: verifyEmailTextTemplate
  }
}

class MailService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendMail(
    to: string,
    subject: string,
    textBody: string,
    htmlBody: string,
    configuration: IConfiguration
  ): Promise<any> {
    if (!configuration.Mail) {
      throw new Error('Failed to load Mail configuration')
    }
    const sendgridApiKeyEncrypted = configuration.Mail.sendgridApiKey

    const mailConfig = configuration.Mail

    if (!mailConfig.fromAddress) {
      throw new Error('From address missing from mail configuration')
    }

    if (sendgridApiKeyEncrypted) {
      const sendgridApiKey = decrypt(sendgridApiKeyEncrypted)
      if (!sendgridApiKey) {
        throw new Error('Invalid sendgrid key')
      }

      sgMail.setApiKey(sendgridApiKey)
      try {
        const msg = {
          from: mailConfig.fromAddress.toString(),
          to: to,
          subject: subject,
          text: textBody,
          html: htmlBody
        }
        let attemptCount = 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any
        do {
          result = await sgMail.send(msg)
        } while (result[0].statusCode !== 202 && attemptCount++ < 3)

        return { success: true }
      } catch (err) {
        console.error(err)
        throw err
      }
    } else {
      const hostAddress = mailConfig.serverAddress

      if (!hostAddress) {
        throw new Error('You must provide a mail server host if using SMTP')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendEmailTemplate(
    templateName: string,
    to: string,
    subject: string,
    context: object,
    configuration: IConfiguration
  ): Promise<any> {
    if (!KNOWN_TEMPLATES[templateName]) {
      throw new Error('Invalid template name: ' + templateName)
    }

    const textBody = this.processTemplateWithContext(KNOWN_TEMPLATES[templateName].text, context)

    const htmlBody = this.processTemplateWithContext(KNOWN_TEMPLATES[templateName].html, context)

    return this.sendMail(to, subject, textBody, htmlBody, configuration)
  }

  private processTemplateWithContext(templateContents: string, context: object): string {
    const templateFunction = handlebars.compile(templateContents)
    return templateFunction(context)
  }
}

export default new MailService()
