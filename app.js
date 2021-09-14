const express = require("express");
const ejsMate = require("ejs-mate");
const expressError = require('./utils/expressError');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');

const Restaurant = require('./models/restaurants');


mongoose.connect('mongodb://localhost:27017/restaurants');

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('Database Connected')
});


const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/home', async (req, res) => {
    const restaurants = await Restaurant.find({});
    console.log(restaurants)
    res.render('home.ejs', { restaurants });
});

app.get('/explore', (req, res) => {
    res.render('explore.ejs');
});

app.get('/profile/:id', (req, res) => {
    res.render('profile.ejs');
});

app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
});

