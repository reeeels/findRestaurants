if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const expressError = require('./utils/expressError');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require("express-session");

const restaurantsRoutes = require('./routes/restaurants');
const userRoutes = require('./routes/users');

const Restaurant = require('./models/restaurant');
const User = require('./models/user');
const helmet = require('helmet');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/restaurants';

mongoose.connect(dbUrl);

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


const secret = process.env.SECRET || "aSecret";

const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://fonts.googleapis.com",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://ajax.googleapis.com/",
    "https://platform.twitter.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
    "https://platform.twitter.com/",
];
const frameSrcUrls = [
    "https://platform.twitter.com/",
];
const manifestSrcUrls = [
    "localhost:8080 ws://localhost:8080",
    "https://json.extendsclass.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://platform.twitter.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
    "https://use.fontawesome.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            frameSrc: ["'self'", ...frameSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djmiqudsv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://s3-media2.fl.yelpcdn.com/",
                "https://s3-media4.fl.yelpcdn.com/",
                "https://s3-media1.fl.yelpcdn.com/",
                "http://example.com/",
                "https://drive.google.com/",
                "https://media.istockphoto.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            manifestSrc: ["'self'", ...manifestSrcUrls]
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/restaurants', restaurantsRoutes);
app.use('/', userRoutes);

app.get('/home', async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('home.ejs', { restaurants, req });
});

app.get('/h', (req, res) => {
    res.render('index');
})

app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});


