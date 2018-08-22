/**
 * Created by bede6362 on 19/06/2017.
 */

'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');

module.exports = function (email, password) {
    const log4n = new Log4n('/models/api/users/setPassword');
    log4n.object(email, 'email');
    log4n.object(password, 'password');

    return new Promise((resolve, reject) => {
        const query = "UPDATE users SET user_password = ? WHERE user_email = ?;";
        const params = [password, email];
        mysqlClient(query, params)
            .then(datas => {
                // log4n.object(datas, 'datas');
                if (typeof datas === 'undefined') throw 'error reading database';
                resolve(datas.affectedRows > 0);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
