import { getInstance } from '@/RealmInstance'
import ConfigurationManager from '@/config/ConfigurationManager'
import { pki } from 'node-forge'
import moment = require('moment')

export const ACME_WEBROOT_PATH = '/usr/local/grayskull/acme'
export const CERTBOT_PATH = '/usr/local/grayskull/ssl'

const Greenlock = require('greenlock')

const certStore = require('le-store-certbot').create({
  configDir: CERTBOT_PATH
})

const challenge = require('le-challenge-fs').create({
  ACME_WEBROOT_PATH
})

const greenlock = Greenlock.create({
  version: 'v02',
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  challenges: {
    'http-01': challenge // handles /.well-known/acme-challege keys and tokens
  },
  protocol: 'http',
  store: certStore,
  challengeType: 'http-01',
  agreeTo: true,
  renewWithin: 14 * 24 * 60 * 60 * 1000, // certificate renewal may begin at this time
  renewBy: 10 * 24 * 60 * 60 * 1000 // certificate renewal should happen by this time
})

export const GreenlockMiddleware = greenlock.middleware

class CertificateService {
  public async verifyCertbot(domain: string): Promise<Boolean> {
    const finalDomain = domain.replace('https://', '')
    try {
      const registerResults = await this.getCertificateFromACMEProvider(finalDomain)
      return !!registerResults
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  private async getCertificateFromACMEProvider(domain: string): Promise<{ cert: string; key: string }> {
    const registerResults = await greenlock.register({
      domains: [domain],
      altNames: [domain],
      email: 'security@letsencrypt.org',
      agreeTos: true,
      rsaKeySize: 2048,
      challengeType: 'http-01'
    })

    return {
      cert: registerResults.cert,
      key: registerResults.privkey
    }
  }

  public async loadCertificateAndUpdateSecureContext() {
    let certObj: {
      key: string
      cert: string
    }
    if (!ConfigurationManager || ConfigurationManager.Server === undefined) {
      certObj = this.generateTemporaryCertificate()
    } else {
      const domain = ConfigurationManager.Server!.baseUrl.replace('https://', '')

      const useCertBot = ConfigurationManager.Server!.enableCertbot || false
      if (useCertBot) {
        const results = await greenlock.check({ domains: [domain] })
        if (results) {
          certObj = {
            cert: results.cert,
            key: results.privkey
          }
        } else {
          certObj = await this.getCertificateFromACMEProvider(domain)
        }
      } else {
        certObj = {
          key: ConfigurationManager.Server!.privateKey || '',
          cert: ConfigurationManager.Server!.certificate || ''
        }
      }
    }
    getInstance().updateSecureContext(certObj)
  }

  private generateTemporaryCertificate(): { key: string; cert: string } {
    const keys = pki.rsa.generateKeyPair(2048)
    const cert = pki.createCertificate()

    cert.publicKey = keys.publicKey
    cert.serialNumber = '01'
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()

    const attrs = []

    cert.setSubject(attrs)
    cert.setIssuer(attrs)

    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 6, // URI
            value: 'http://example.org/webid#me'
          },
          {
            type: 7, // IP
            ip: '127.0.0.1'
          }
        ]
      },
      {
        name: 'subjectKeyIdentifier'
      }
    ])

    cert.sign(keys.privateKey)
    const pemCertificate = pki.certificateToPem(cert)

    return { key: pki.privateKeyToPem(keys.privateKey), cert: pemCertificate }
  }
}

export default new CertificateService()
