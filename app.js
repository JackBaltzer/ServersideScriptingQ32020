const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());


const logger = require('morgan');
app.use(logger('dev', {
	// hvis ALLE requests skal ses i loggen, udkommenter næste linje
	skip: req => !req.url.endsWith('.html') && req.url.indexOf('.') > -1
}));


app.set('view engine', 'ejs');
app.set('views', './views');


const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost:27017/ServerSideScriptingQ32020', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});


app.get('/test', (req, res) => {
	res.render('test', {
		page: 'test'
	});
});


require('./routes.js')(app);




app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server started: http://localhost:${port}`);
});