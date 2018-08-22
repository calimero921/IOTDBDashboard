/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';


'use strict';

const Log4n = require('../../../utils/log4n.js');
const mysqlClient = require('../../mysqlclient.js');
const getUserByEmail = require('./getByEmail.js');
const setToken = require('./setToken.js');

module.exports = function (data) {
    const log4n = new Log4n('/models/api/users/set');
    // log4n.object(data, 'data');

    return new Promise((resolve, reject) => {
        const queryUpdate = "UPDATE users SET user_password = ?, user_firstname = ?, user_lastname = ?, user_admin_state = ? WHERE user_email = ?;";
        const queryInsert = "INSERT INTO users (user_email, user_password, user_firstname, user_lastname, user_admin_state) VALUES (?, ?, ?, ?, ?);";

        var user = data;
        getUserByEmail(data.email)
            . then (datas => {
                log4n.object(datas, 'users');
                //test si l'utilisateur existe => update, sinon => insert
                if(datas.length > 0) {
                    user.password = datas[0].password;
                    const paramsUpdate = [data.password, data.firstname, data.lastname, data.admin, data.email];
                    return mysqlClient(queryUpdate, paramsUpdate);
                }
                const paramsInsert = [data.email, data.password, data.firstname, data.lastname, data.admin];
                return mysqlClient(queryInsert, paramsInsert);
            })
            .then(datas => {
                // log4n.object(data, 'data');
                if (typeof data === 'undefined') throw 'error inserting data';
                if (data.affectedRows === 0) throw 'no data inserted';
                return setToken(data.email);
            })
            .then(data => {
                // log4n.object(data, 'token');
                if(typeof data === 'undefined') throw 'no password token created';
                user.token = data;
                resolve(user);
            })
            .catch(error => {
                log4n.error(error);
                reject(error);
            });
    });
};
