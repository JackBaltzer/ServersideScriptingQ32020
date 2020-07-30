const Book = require("./models/bookModel");
const express = require('express');

module.exports = (app) => {




	app.use(express.static('public'));

	app.get('/', (req, res) => {

		Book.countDocuments().exec(function (err, count) {
			var random = Math.floor(Math.random() * count);
			Book.findOne().skip(random).exec(
				function (err, book) {
					console.log(book);
					res.render('index', {
						page: 'home',
						book
					});
				});
		});

	});


	app.get('/book', async (req, res) => {
		// collation locale en for at sortering bliver case insensive
		let books = await Book.find().collation({
			locale: "en"
		}).sort({
			'title': 'asc'
		});
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

				let books = await Book.find().sort({
					'title': 'asc'
				});
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
};