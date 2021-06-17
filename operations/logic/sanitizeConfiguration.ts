import { PASSWORD_PLACEHOLDER } from "../../foundation/constants";
import { IConfiguration } from "../../foundation/types/types";

export function sanitizeConfiguration (configuration: IConfiguration): IConfiguration {
  configuration.Mail.password = PASSWORD_PLACEHOLDER
	configuration.Mail.sendgridApiKey = PASSWORD_PLACEHOLDER
	configuration.Security.twilioApiKey = PASSWORD_PLACEHOLDER
	configuration.Security.twilioSID = PASSWORD_PLACEHOLDER

  configuration.Security.smsFromNumber = PASSWORD_PLACEHOLDER
  
  configuration.Mail.serverAddress = PASSWORD_PLACEHOLDER
  configuration.Mail.username = PASSWORD_PLACEHOLDER
  

  return configuration
}
