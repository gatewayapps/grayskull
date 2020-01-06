import nodemailer, { SendMailOptions, TransportOptions } from 'nodemailer'
import sgMail from '@sendgrid/mail'
import handlebars from 'handlebars'
import SettingsService from './SettingService'
import ConfigurationManager from '../../config/ConfigurationManager'
import { SettingsKeys } from '../../config/KnownSettings'
import { decrypt } from '../../utils/cipher'

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

const TEMPLATE_PATH = './server/templates'

class MailService {
  public async sendMail(to: string, subject: string, textBody: string, htmlBody: string): Promise<any> {
    const sendgridApiKeyEncrypted = await SettingsService.getStringSetting(SettingsKeys.MAIL_SENDGRID_API_KEY)

    const config = await ConfigurationManager.GetCurrentConfiguration(false)

    const mailConfig = config.Mail!

    if (sendgridApiKeyEncrypted) {
      const sendgridApiKey = decrypt(sendgridApiKeyEncrypted)
      sgMail.setApiKey(sendgridApiKey!)
      try {
        const msg = {
          from: mailConfig.fromAddress!,
          to: to,
          subject: subject,
          text: textBody,
          html: htmlBody
        }
        sgMail.send(msg)
        return { success: true }
      } catch (err) {
        console.error(err)
        throw err
      }
    } else {
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
  }

  public sendEmailTemplate(templateName: string, to: string, subject: string, context: object): Promise<any> {
    if (!KNOWN_TEMPLATES[templateName]) {
      throw new Error('Invalid template name: ' + templateName)
    }

    const textBody = this.processTemplateWithContext(KNOWN_TEMPLATES[templateName].text, context)

    const htmlBody = this.processTemplateWithContext(KNOWN_TEMPLATES[templateName].html, context)

    return this.sendMail(to, subject, textBody, htmlBody)
  }

  private processTemplateWithContext(templateContents: string, context: object): string {
    const templateFunction = handlebars.compile(templateContents)
    return templateFunction(context)
  }
}

export default new MailService()
