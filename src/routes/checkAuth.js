const auth = require('basic-auth');
const Log4n = require('../utils/log4n.js');
const responseError = require('../utils/responseError.js');
const errorParsing = require('../utils/errorparsing.js');
const accountGetModels = require('../models/database/account/get.js');

module.exports = function (req, res, next) {
    const log4n = new Log4n('/routes/checkauth');
    let credentials = auth(req);
    log4n.object(credentials, 'credentials');

    if (typeof credentials === 'undefined') {
        log4n.info('error no credentials found');
        responseError(errorParsing({error_code: 401}), res, log4n);
    } else {
        accountGetModels({'login': credentials.name, 'password': credentials.pass}, 0, 0)
            .then(result => {
                // log4n.object(result, 'result');
                if(result.length > 0) {
                    log4n.debug('check Ok');
                    next();
                } else {
                    responseError(errorParsing({error_code: 403}), res, log4n);
                }
            })
            .catch(err => {
                responseError(errorParsing({error_code: 403}), res, log4n);
            });
    }
};

// function checkAuth(req, res, next) {
//     const log4n = new Log4n('/routes/main/checkauth');
//     log4n.object(req.sessionID, 'session_id');
//
//     let config = {};
//     config.title = "Signin";
//
//     if (typeof req.sessionID === 'undefined') {
//         log4n.info('error no session found');
//         res.render('identity/signin/index.html', config);
//     } else {
//         accountGetBySession(req.sessionID)
//             .then(result => {
//                 // log4n.object(result, 'result');
//                 if(result.length > 0) {
//                     log4n.debug('session found');
//                     next();
//                 } else {
//                     log4n.info('no user currently associated to this session');
//                     res.render('identity/signin/index.html', config);
//                 }
//             })
//             .catch(err => {
//                 log4n.info('error getting session information');
//                 res.render('identity/signin/index.html', config);
//             });
//     }
// }