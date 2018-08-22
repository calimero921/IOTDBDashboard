/**
 * Created by bede6362 on 19/06/2017.
 */
'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const transUser = require('./trans.js');

module.exports = function (email) {
    const log4n = new Log4n('/models/api/users/getByEmail');
    log4n.object(email, 'email');

    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE user_email = ?;";
        const params = [email];
        mysqlClient(query, params)
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
