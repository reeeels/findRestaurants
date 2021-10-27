const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const restaurants = require('../controllers/restaurants');
const Restaurant = require('../models/restaurant');
const { isLoggedIn, isAuthor, validateRestaurant } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(restaurants.index))
    .post(isLoggedIn, upload.array('image'), validateRestaurant, catchAsync(restaurants.createRestaurant))

router.get('/new', isLoggedIn, restaurants.renderNewForm);

router.route('/:id')
    .get(catchAsync(restaurants.showRestaurant))
    .put(isLoggedIn, catchAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn, catchAsync(restaurants.deleteRestaurant))

router.get('/:id/edit', isLoggedIn, catchAsync(restaurants.renderEditForm))


module.exports = router;