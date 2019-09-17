/**
 * Created by bede6362 on 19/06/2017.
 */

const Log4n = require('../../../utils/log4n.js');
const sendMail = require('../../../utils/sendMail.js');
const responseError = require('../../../utils/responseError.js');
const server = require('../../../config/server.js');
const getUsersByEmail = require('../../../models/database/users/getByEmail.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/users/recover');
    log4n.object(req.params.email, 'email');

    var transporter;
    var user;
    getUsersByEmail(req.params.email)
        .then(datas => {
            // log4n.object(datas, 'datas');
            if (typeof datas === 'undefined') throw 'error reading database';
            if (datas.length === 0) throw 'no user for this email';
            user = datas[0];

            log4n.debug('get user info');
            var receiver = "";
            for(var key in datas) {receiver += ';' + datas[key].email;}
            receiver = receiver.substr(1);
            log4n.object(receiver, 'receiver');

            return sendMail(
                receiver,
                'Reset your cSam password',
                'Please click on the above button to change your password in three hours.<br>If it does not work, please paste the link into your web browser\'s address field to complete the registration process..<br>Link: <a href="' + server.url + '/reset/' + user.email + '/' + user.token + '">' + server.url + '/reset/' + user.email + '/' + user.token + '</a>',
                'Please click on the above button to change your password in three hours.\r\nIf it does not work, please paste the link into your web browser\'s address field to complete the registration process..\r\n' + server.url + '/reset/' + user.email + '/' + user.token
            );
        })
        .then(result => {
            res.send(decodeError(result));
        })
        .catch(error => {
            log4n.object(error, 'Error')
            responseError(error, res, log4n)
        });
};

function decodeError(error) {
    const log4n = new Log4n('/routes/api/users/recover/decodeError');
    log4n.object(error, 'error');
    var value = {};
    value.code = "500";
    value.message = "Internal Server Error";

    if (typeof error !== 'undefined') {
        value.code = error.substr(0, 3);
        value.message = error.substr(3);
    }
    return value;
}