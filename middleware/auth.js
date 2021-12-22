module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/user/login');
    }
    next();
}