const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('signup.ejs');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Ready to findRestaurants?! ${user.username}`);
            res.redirect('/home');
        });
    } catch (e) {
        req.flash('error', e.message)
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('login.ejs');
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    req.flash('success', `You're back on!, ${username}`)
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/home');
}