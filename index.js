const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortURL = require('./models/url')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
	const allData = await ShortURL.find()
	res.render('index', { shortUrls: allData })
})

app.post('/short', async (req, res) => {
	const fullUrl = req.body.fullUrl
	console.log('URL requested: ', fullUrl)

	const record = new ShortURL({
		full: fullUrl
	})

	await record.save()

	res.redirect('/')
})

app.get('/:shortid', async (req, res) => {
	const shortid = req.params.shortid

	const rec = await ShortURL.findOne({ short: shortid })

	if (!rec) return res.sendStatus(404)

	rec.clicks++
	await rec.save()
	res.redirect(rec.full)
})

mongoose.connect('mongodb://127.0.0.1/urlDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async () => {
	app.listen(3000, () => {
		console.log('Server started')
	})
})