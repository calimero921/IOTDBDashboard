const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const transUser = require('./trans.js');

module.exports = function (sessionid) {
    const log4n = new Log4n('/models/api/users/getBySession');
    log4n.object(sessionid, 'sessionid');

    return new Promise((resolve, reject) => {
        const query = "select * from users where user_session_id = ?;";
        const params = [sessionid];
        return mysqlClient(query, params)
            .then(result => {
                // log4n.object(result, 'result');
                resolve(transUser(result));
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
