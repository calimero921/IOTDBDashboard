/**
 * Created by bede6362 on 19/06/2017.
 */

const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const checkUsers = require('../../../models/database/users/check.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/users/check');
    // log4n.object(req.params.email, 'email');
    // log4n.object(req.params.password, 'password');

    checkUsers(req.params.email, req.params.password, req.session.id)
        .then(result => {
            log4n.object(result, 'result');
            var value = {}
            value.checked = result;

            res.send(value);
        })
        .catch(error => responseError(error, res, log4n));
};