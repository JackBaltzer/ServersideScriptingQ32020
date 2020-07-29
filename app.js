const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", "./views");


app.get('/', (req, res) => {
	res.render('index', {
		page: 'home'
	});
});


app.route('/book')
	.get((req, res) => {
		res.render('book', {
			page: 'book'
		});
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