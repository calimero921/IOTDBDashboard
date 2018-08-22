/**
 * Created by bede6362 on 19/06/2017.
 */

const Log4n = require('../../../utils/log4n.js');
const responseError = require('../../../utils/responseError.js');
const getUsersBySession = require('../../../models/api/users/delete.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/routes/api/users/delete');
    log4n.object(req.params.email, 'email');

    getUsersBySession(req.params.email)
        .then(result => {
            log4n.object(result, 'result');
            if(result === true) {
                res.status(200);
                res.send("Ok");
            }  else {
                res.status(500);
                res.send("Internal Server Error");
            }
        })
        .catch(error => responseError(error, res, log4n));
};