const data = require('./assets/characters.json')

console.log(data)

const jsonData = new Promise((resolve, reject) => {
	fetch('./assets/characters.json')
	.then(res => {
		resolve(res.json())
	}).catch(err => {
		reject(err)
	})
})

console.log(jsonData)