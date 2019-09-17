const jwt = require('jsonwebtoken');
const Log4n = require('./log4n.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/utils/id_token');
    return new Promise((resolve, reject) => {

        // log4n.object(Object.keys(req.session), 'header');

        if (typeof req.session['keycloak-token'] !== 'undefined') {
            let keycloak_token = JSON.parse(req.session['keycloak-token']);
            // log4n.object(keycloak_token, 'keycloak_token');

            let id_token = keycloak_token.id_token;
            // log4n.object(id_token, 'id_token');

            let decodedToken = jwt.decode(id_token);
            // log4n.object(decodedToken, 'decodedToken');
            resolve(decodedToken);
        } else {
            log4n.debug('no token found to identify user.');
            resolve();
        }
    });
};
