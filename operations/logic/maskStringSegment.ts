export function maskStringSegment(input: string, maskStart: number, maskLength: number | undefined = undefined) {
	return `${input.substr(0, maskStart)}${input.substr(maskStart, maskLength).replace(/[a-zA-Z0-9]/gi, '*')}${
		maskLength ? input.substr(maskStart + maskLength) : ''
	}`
}
