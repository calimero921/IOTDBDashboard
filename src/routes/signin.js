const Log4n = require('../utils/log4n.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/signin');

    try {
        let config = {title: req.t('identity:page.signin.title')};
        res.render('identity/signin/index.html', config);
    } catch (error) {
        log4n.error(error);
        config.message = error;
        res.render('error.html', config);
    }
};