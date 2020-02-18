import handlebars from 'handlebars'
import { IConfiguration } from '../../../foundation/types/types'
import { sendEmailUsingSendgrid } from './sendEmailUsingSendgrid'
import { sendEmailUsingNodemailer } from './sendEmailUsingNodemailer'

const activateAccountHtmlTemplate = require('./templates/activateAccountTemplate.html.handlebars').default
const activateAccountTextTemplate = require('./templates/activateAccountTemplate.text.handlebars').default

const backupCodeHtmlTemplate = require('./templates/backupCodeTemplate.html.handlebars').default
const backupCodeTextTemplate = require('./templates/backupCodeTemplate.text.handlebars').default

const resetPasswordHtmlTemplate = require('./templates/resetPasswordTemplate.html.handlebars').default
const resetPasswordTextTemplate = require('./templates/resetPasswordTemplate.text.handlebars').default

const verifyEmailHtmlTemplate = require('./templates/verifyEmailTemplate.html.handlebars').default
const verifyEmailTextTemplate = require('./templates/verifyEmailTemplate.text.handlebars').default

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

export function processTemplateWithContext(templateContents: string, context: object): string {
  const templateFunction = handlebars.compile(templateContents)
  return templateFunction(context)
}

export async function sendTemplatedEmail(
  templateName: string,
  to: string,
  subject: string,
  context: object,
  config: IConfiguration
) {
  if (!KNOWN_TEMPLATES[templateName]) {
    throw new Error('Invalid template name: ' + templateName)
  }

  const textBody = processTemplateWithContext(KNOWN_TEMPLATES[templateName].text, context)

  const htmlBody = processTemplateWithContext(KNOWN_TEMPLATES[templateName].html, context)

  if (config.Mail.sendgridApiKey) {
    await sendEmailUsingSendgrid(to, subject, textBody, htmlBody, config.Mail)
  } else {
    await sendEmailUsingNodemailer(to, subject, textBody, htmlBody, config.Mail)
  }
}
