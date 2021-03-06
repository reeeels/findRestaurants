const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const RestaurantSchema = new Schema({
    alias: String,
    name: String,
    url: String,
    image: String,
    location: {},
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    closed: Boolean,
    rating: Number,
    ratingCount: Number,
    price: String,
    phone: String,
    display_phone: String,
    distance: Number,
    transactions: [],
    categories: [],
}, opts);

RestaurantSchema.virtual('properties.popUp').get(function () {
    return `<strong class="link text-center"><a href="${this.url}">${this.name}</a><strong>`
});


//RestaurantSchema.virtual('properties.popUpMarkup').get(function () {
//    return `<strong class="link text-center"><a href="/campgrounds/${this._id}">${this.title}</a><strong>`
//});


module.exports = mongoose.model('Restaurant', RestaurantSchema);
