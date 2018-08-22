/* GET rechercher page. */
const Log4n = require('../../../utils/log4n.js');
const sendMail = require('../../../utils/sendMail.js');
const responseError = require('../../../utils/responseError.js');
const createPassword = require('../account/createPassword.js');
const server = require('../../../config/server.js');
const getUsersByEmail = require('./getByEmail.js');
const setUsersPassword = require('./setPassword.js');

module.exports = function (email) {
    const log4n = new Log4n('/models/api/users/init');
    log4n.object(email, 'email');

    return new Promise((resolve, reject) => {
        var transporter;
        var user;
        getUsersByEmail(email)
            .then(datas => {
                log4n.object(datas, 'datas');
                if (datas.length === 0) throw 'no content';

                log4n.debug('get user info');
                user = datas[0];
                user.password = createPassword();
                return setUsersPassword(user.email, user.password);
            })
            .then(datas => {
                log4n.object(datas, 'datas');
                if(typeof datas === 'undefined') throw 'error writing database';
                if(datas = false) throw 'error writing password for user ' + user.email;

                return sendMail(
                    user.email,
                    'Initialize your cSam password',
                    'Please click on the above button to initialize your password in three hours.<br>If it does not work, please paste the link into your web browser\'s address field to complete the registration process..<br>Link: <a href="' + server.url + '/reset/' + user.email + '/' + user.token + '">' + server.url + '/reset/' + user.email + '/' + user.token + '</a>',
                    'Please click on the above button to initialize your password in three hours.\r\nIf it does not work, please paste the link into your web browser\'s address field to complete the registration process..\r\n' + server.url + '/reset/' + user.email + '/' + user.token
                );
            })
            .then(result => {
                log4n.object(result, 'result');
                resolve(result);
            })
            .catch(error => {
                log4n.object(error, 'Error');
                reject(error);
            });
    });
};