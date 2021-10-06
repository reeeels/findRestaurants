const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('signup.ejs');
}

module.exports.register = async (req, res) => {
    try {
        const { email, firstname, username, password } = req.body;
        const user = new User({ email, firstname, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Ready to findRestaurants, ${user.firstname}?!`);
            res.redirect('/home');
        });
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/home');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('login.ejs');
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({ username });
    req.flash('success', `You're back on! ${user[0].firstname}`)
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', `We'll miss you :\\`);
    res.redirect('/home');
}