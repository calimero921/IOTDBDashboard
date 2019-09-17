/**
 * Created by bede6362 on 19/06/2017.
 */

const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const getUsersByEmail = require('../../../models/database/users/getByEmail.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/users/getByEmail');
    log4n.object(req.params.email, 'email');

    getUsersByEmail(req.params.email)
        .then(result => {
            // log4n.object(result, 'result');
            res.send(result);
        })
        .catch(error => responseError(error, res, log4n));
};