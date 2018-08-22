const Log4n = require('../utils/log4n');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/recover');

    let config = {title: req.t('identity:page.recover.title')};

    // log4n.object(config, 'config');
    res.render('identity/recover/index.html', config);
};