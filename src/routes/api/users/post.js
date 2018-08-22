/**
 * routage pour api post /user
 */

/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const Log4n = require('../../../utils/log4n.js');
const getConfig = require('../../../utils/getconfig.js');
const decodePost = require('../../../utils/decodePost.js');
const responseError = require('../../../utils/responseError.js');
const smtp = require('../../../config/smtp.js');
const server = require('../../../config/server.js');
const setUser = require('../../../models/api/users/set.js');
const initPassword = require('../../../models/api/users/init.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/router/api/users/post');
    let config = {};
    var user = {};

    getConfig(req, res)
        .then(data => {
		    // log4n.object(data, 'config');
            if(typeof data === 'undefined') throw "no config found";
            config = data;

            return decodePost(req, res);
        })
        .then(data => {
		    // log4n.object(data, 'decodepost');
            if(typeof data === 'undefined') throw "no data in body";
            return setUser(data);
        })
        .then(data => {
            // log4n.object(data, 'data');
            if(typeof data === 'undefined') throw "error writing in database";
            if(data.password.length === 0) {
                return initPassword(data.email);
            }
            return "250 Data received OK.";
        })
        .then(data => {
            log4n.object(data, 'error');
            if(typeof data === 'undefined') throw "sendmail error";
            if(data != "250 Data received OK.") throw "error sending password initialisation mail";
            res.status(200);
            res.send(data.message);
        })
        .catch(error => responseError(error, res, log4n));
};