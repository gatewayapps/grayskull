import * as libphonenumber from 'google-libphonenumber'
import { maskStringSegment } from './maskStringSegment'
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

export function maskPhoneNumber(phoneNumber: string) {
	const parsedValue = phoneUtil.parse(phoneNumber, 'US')
	const formattedValue = phoneUtil.format(parsedValue, libphonenumber.PhoneNumberFormat.INTERNATIONAL)
	return maskStringSegment(formattedValue, 3, formattedValue.length - 7)
}
