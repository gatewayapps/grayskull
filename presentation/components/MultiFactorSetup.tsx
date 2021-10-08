import gql from 'graphql-tag'
import qrcode from 'qrcode'
import React from 'react'
import { useMutation } from 'react-apollo'
import urlParse from 'url-parse'
import LoadingIndicator from './LoadingIndicator'
import { CopyTextField } from './CopyTextField'
import AdaptiveInput, { AdaptiveInputOnChangeFunc } from './AdaptiveInput'

interface GenerateMfaKeyData {
	generateMfaKey: string | null
}

interface GenerateMfaKeyVariables {
	emailAddress: string
}

const GENERATE_MFA_KEY = gql`
	mutation GENERATE_MFA_KEY($emailAddress: String!) {
		generateMfaKey(data: { emailAddress: $emailAddress })
	}
`

interface VerifyMfaKeyData {
	verifyMfaKey: boolean | null
}

interface VerifyMfaKeyVariables {
	secret: string
	token: string
}

const VERIFY_MFA_KEY = gql`
	mutation VERIFY_MFA_KEY($secret: String!, $token: String!) {
		verifyMfaKey(data: { secret: $secret, token: $token })
	}
`

export interface MultiFactorSetupProps {
	emailAddress: string
	required?: boolean
	onCancel?: () => void
	onVerified: (otpSecret: string) => void
}

interface MultiFactorSetupState {
	keyUri: string
	otpSecret: string
	qrcodeImage: string
}

const defaultMfaState: MultiFactorSetupState = Object.freeze({
	keyUri: '',
	otpSecret: '',
	qrcodeImage: ''
})

const MultiFactorSetup = ({ emailAddress, onCancel, onVerified, required }: MultiFactorSetupProps) => {
	const [mfaState, setMfaState] = React.useState({ ...defaultMfaState })
	const [token, setToken] = React.useState('')
	const [isVerified, setIsVerified] = React.useState(false)
	const [showSecret, setShowSecret] = React.useState(false)
	const [generateMfaKey] = useMutation<GenerateMfaKeyData, GenerateMfaKeyVariables>(GENERATE_MFA_KEY)
	const [verifyMfaKey] = useMutation<VerifyMfaKeyData, VerifyMfaKeyVariables>(VERIFY_MFA_KEY)

	const generateQrCodeImage = React.useCallback((mfaKey: string): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			qrcode.toDataURL(mfaKey, (err, qrImage) => {
				if (err) {
					reject(err)
				} else {
					resolve(qrImage)
				}
			})
		})
	}, [])

	const generateSecret = React.useCallback(
		async (emailAddress: string) => {
			const { data } = await generateMfaKey({
				variables: { emailAddress }
			})
			if (data?.generateMfaKey) {
				const qrcodeImage = await generateQrCodeImage(data.generateMfaKey)
				const parsed = urlParse(data.generateMfaKey, true)

				setMfaState({
					keyUri: data.generateMfaKey,
					otpSecret: parsed.query.secret || '',
					qrcodeImage
				})
				setToken('')
				setIsVerified(false)
				setShowSecret(false)
			}
		},
		[generateQrCodeImage, generateMfaKey]
	)

	React.useEffect(() => {
		generateSecret(emailAddress)
	}, [emailAddress, generateSecret])

	const verifyToken = React.useCallback(async () => {
		const { data } = await verifyMfaKey({
			variables: { secret: mfaState.otpSecret, token: token.split(',').join('') }
		})
		if (data?.verifyMfaKey === true) {
			setIsVerified(true)
			onVerified(mfaState.otpSecret)
		}
	}, [verifyMfaKey, mfaState.otpSecret, token, onVerified])

	const cancelSetup = React.useCallback(() => {
		if (required) {
			return false
		}

		setMfaState({ ...defaultMfaState })
		setToken('')
		setIsVerified(false)
		setShowSecret(false)

		if (onCancel) {
			onCancel()
		}
	}, [required, onCancel])

	const handleTokenChanged: AdaptiveInputOnChangeFunc = React.useCallback((evt) => {
		setToken(evt.target.value)
	}, [])

	const displaySecret = React.useCallback(() => setShowSecret(true), [])

	return (
		<div>
			<h5>Multi-Factor Authentication</h5>
			{!mfaState.keyUri && <LoadingIndicator />}
			{mfaState.keyUri && (
				<div>
					<ol>
						<li>Install an &quot;authenticator&quot; app from the app store on your phone.</li>
						<li>Open the app.</li>
						<li>
							Scan this barcode with your authenticator app.
							<div>
								<img src={mfaState.qrcodeImage} />
							</div>
							{!showSecret && (
								<button className="btn btn-link" onClick={displaySecret}>
									I can&apos;t scan the bar code
								</button>
							)}
							{showSecret && (
								<div className="mb-3">
									<CopyTextField
										id="copy-otp-secret"
										label="Type the following key into your authenticator app"
										text={mfaState.otpSecret}
									/>
								</div>
							)}
						</li>
						{!isVerified && (
							<li>
								<p>Verify the authenticator app is setup correctly by entering a code below.</p>
								<div className="mb-3">
									<AdaptiveInput
										type="otp"
										className="form-control"
										name="token"
										placeholder="Enter code here"
										value={token}
										onChange={handleTokenChanged}
									/>
								</div>
								<div>
									<button className="btn btn-primary" onClick={verifyToken}>
										Verify Code
									</button>
									{!required && (
										<button className="btn btn-link" onClick={cancelSetup}>
											Cancel
										</button>
									)}
								</div>
							</li>
						)}
						{isVerified && <li>Authentication code verified!</li>}
					</ol>
				</div>
			)}
		</div>
	)
}

export default MultiFactorSetup
