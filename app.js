const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


const logger = require("morgan");
app.use(logger("dev", {
	// hvis ALLE requests skal ses i loggen, udkommenter næste linje
	skip: req => !req.url.endsWith(".html") && req.url.indexOf(".") > -1
}));


app.set("view engine", "ejs");
app.set("views", "./views");


const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://localhost:27017/ServerSideScriptingQ32020", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


app.get('/', (req, res) => {
	res.render('index', {
		page: 'home'
	});
});


const Book = require("./models/bookModel");


app.get('/book', async (req, res) => {
	// collation locale en for at sortering bliver case insensive
	let books = await Book.find().collation({ locale: "en" }).sort({'title':'asc'});
	res.render('book', {
		page: 'book',
		books
	});
});


app.post('/book', (req, res) => {
	let book = new Book(req.body);
	book.save();
	res.redirect('book');
});


app.get('/book/edit/:bookId', async (req, res) => {
	try {
		let book = await Book.findById(req.params.bookId);
		if (book == null) {
			res.redirect(404, '/book');
		} else {

			let books = await Book.find().sort({'title':'asc'});
			res.render('book', {
				page: 'book',
				book,
				books
			});
		}
	} catch (err) {
		console.log(err)
		res.redirect('/book');
	}
});


app.post('/book/edit/:bookId', async (req, res) => {
	let book = await Book.findByIdAndUpdate(req.params.bookId, req.body);
	res.redirect('/book');
});


app.get('/book/delete/:bookId', async (req, res) => {
	let book = await Book.findByIdAndDelete(req.params.bookId);
	res.redirect('/book');
});


app.get('/test', (req, res) => {
	res.render('index', {
		page: 'test'
	});
});


app.use(express.static('public'));


app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Server started: http://localhost:' + port);
});