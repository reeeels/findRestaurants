const Restaurant = require('../models/restaurant');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = 'pk.eyJ1IjoidGVtaWxvbHV3YWlnZSIsImEiOiJja3RnMHduZmgwZG1iMnVwbmd4Y2Q4bmpuIn0.Au0Z4YcGZTo22tQjOGbbZQ';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('explore', { restaurants, req })
}

module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new');
}

module.exports.createRestaurant = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    restaurant.author = req.user._id;
    await restaurant.save();
    console.log(restaurant);
    req.flash('success', 'New Restaurant Made')
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.showRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    console.log(restaurant);
    if (!restaurant) {
        req.flash('error', 'Cannot find that Restaurant');
        return res.redirect('/restuarants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        req.flash('success', 'Cannot find that Restaurant');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurant.images.push(...imgs);
    await restaurant.save();
    req.flash('success', 'Edit Applied!');
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Deleted!!!');
    res.redirect(`/restaurants`);
}