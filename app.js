const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/kittens')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const bookSchema = mongoose.Schema({
	dateStart: Date,
	dateEnd: Date,
	bookTitle: String,
	bookAuthor: String,
	bookStatus: String
})
const Book = mongoose.model('Book', bookSchema)

// Helpers
const {
	formatDate
}	= require('./helpers/pug')

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

// View engine
app.set('views', './views')
app.set('view engine', 'pug')

// App locals
app.locals = {
	formatDate
}

// Routes
// To do: set proper routes
app.get('/', (req, res, next) => {
	res.render('index')
})

app.get('/about', (req, res) => {
	res.render('about')
})

app.get('/book/:id', (req, res) => {
	Book.findOne({_id: req.params.id})
		.then((book) => {
			res.render('books/single', {book})
		})
})

// Show book list
app.get('/books', (req, res) => {
	Book.find()
		.then((books) => {
			res.render('books', {
				books
			})
		})
})

app.post('/books/add', (req, res) => {
	console.log(req.body)
	const book = new Book({
		dateStart: req.body.dateStart,
		dateEnd: req.body.dateEnd,
		bookTitle: req.body.bookTitle,
		bookAuthor: req.body.bookAuthor,
		bookStatus: req.body.bookStatus
	}).save((err, user) => {
		if (err) return console.error(err)
	})
	res.redirect('/books')
})

// Delete book from db
app.delete('/book/:id', (req, res) => {
	res.send('delete')
	// Book.remove({_id: req.params.id})
	// 	.then(() => {
	// 		res.redirect('/books')
	// 	})
})

// Set static files
app.use(express.static(__dirname + '/public/'))

const port = 5000

app.listen(port, () => {
	console.log(`Server started on port ${port} ...`)
})