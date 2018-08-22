const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');

module.exports = function (email, sessionid) {
    const log4n = new Log4n('/models/api/users/setSession');
    log4n.object(email, 'email');
    log4n.object(sessionid, 'sessionid');

    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET user_session_id = ? WHERE user_email = ?;";
        const params = [sessionid, email];
        mysqlClient(query, params)
            .then(result => {
                // log4n.object(result, 'result');
                if(typeof result === 'undefined') throw 'error reading database';
                resolve(result.affectedRows > 0);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
