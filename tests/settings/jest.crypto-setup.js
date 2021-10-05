global.crypto = {
	getRandomValues: (arr) => require('crypto').randomFillSync(arr)
}
