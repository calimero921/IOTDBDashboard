const Log4n = require('../utils/log4n.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/signon');

    try {
        let config = {title: req.t('identity:page.signon.title')};
        res.render('identity/signon/index.html', config);
    } catch (error) {
        log4n.error(error);
        config.message = error;
        res.render('error.html', config);
    }
};