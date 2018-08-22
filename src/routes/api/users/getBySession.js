/**
 * Created by bede6362 on 19/06/2017.
 */

const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const getUsersBySession = require('../../../models/api/users/getBySession.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/users/getBySession');
    log4n.object(req.session.id, 'session_id');

    getUsersBySession(req.session.id)
        .then(result => {
            // log4n.object(result, 'result');
            res.send(result);
        })
        .catch(error => responseError(error, res, log4n));
};