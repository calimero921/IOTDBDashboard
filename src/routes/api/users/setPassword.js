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
const getUsersByEmail = require('../../../models/api/users/getByEmail.js');
const setUsersPassword = require('../../../models/api/users/setPassword.js');

module.exports = function (req, res) {
    const log4n = new Log4n('/router/api/users/setPassword');
    let config = {};
    var form;
    var user;
    decodePost(req, res)
        .then(data => {
            log4n.object(data, 'form');
            if (typeof data === 'undefined') throw "no data in body";
            form = data;
            return getUsersByEmail(form.email);
        })
        .then(data => {
            log4n.object(data, 'user');
            if(typeof data === 'undefined') throw "error reading database";
            if(data.length === 0) throw "unknown user in database (" + form.email + ")";
            user = data[0];
            if(form.token != user.token) throw "wrong token for this operation";
            return setUsersPassword(form.email, form.password);
        })
        .then(data => {
            // log4n.object(data, 'result');
            if (typeof data === 'undefined') throw "error writing in database";
            res.send(data);
        })
        .catch(error => responseError(error, res, log4n));

    var form;
};