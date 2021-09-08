const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const RestaurantSchema = new Schema({
    alias: String,
    name: String,
    url: String,
    image: String,
    categories: [],
    location: [],
    coordinates: {},
    closed: Boolean,
    rating: Number,
    ratingCount: Number,
}, opts);

//RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
//    return `<strong class="link text-center"><a href="/campgrounds/${this._id}">${this.title}</a><strong>`
//});


module.exports = mongoose.model('Restaurant', RestaurantSchema);