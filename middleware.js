const { restaurantschema } = require('./schemas.js');
const Restaurant = require('./models/restaurant');
const expressError = require('./utils/expressError');

module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please Sign In');
        return res.redirect('/login');
    }
    next();
})

module.exports.validateRestaurant = (req, res, next) => {
    console.log(req.body);
    const { error } = restaurantschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const restaurant = await Restaurant.findById(id);
//     console.log(restaurant.author);
//     console.log(req.user._id);
//     if (restaurant.author == req.user._id) {
//         next();
//     } else {
//         req.flash('error', 'You dont have permission');
//         return res.redirect(`/restaurants/${restaurant._id}`);
//     }
// }