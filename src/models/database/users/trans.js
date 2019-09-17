/**
 * Created by bede6362 on 20/06/2017.
 */

'use strict';

const Log4n = require('../../../utils/log4n.js');

module.exports = function (datas) {
    const log4n = new Log4n('/models/api/users/trans');

    var result= [];

    try{
        if(typeof datas !== 'undefined') {
            if(datas.length > 0) {
                for(var i=0; i< datas.length; i++) {
                    var user = {};
                    user.session = datas[i].user_session_id;
                    user.firstname = datas[i].user_firstname;
                    user.lastname = datas[i].user_lastname;
                    user.email = datas[i].user_email;
                    user.password = datas[i].user_password;
                    user.current = datas[i].user_current_connection_date;
                    user.last = datas[i].user_last_connection_date;
                    user.token = datas[i].user_reset_password_token;
                    user.admin = false;
                    if(datas[i].user_admin_state === 1) user.admin = true;
                    result.push(user);
                }
            }
        }
    } catch(error) {
        log4n.error('error: ' + error);
    }

    // log4n.object(result, 'result');
    return result;
};

