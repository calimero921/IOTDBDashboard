const Log4n = require('../utils/log4n.js');

module.exports = function(req, res) {
    const log4n = new Log4n('/routes/logout');
    log4n.debug('strat');
    log4n.debug('session : ' + typeof session);

    if(typeof req.session !== 'undefined') {
        log4n.debug('destroy current session');
        req.session.destroy();
    }

    log4n.debug('redirect to home page');
    res.writeHead(302, {'Location': '/'});
    res.end();
};