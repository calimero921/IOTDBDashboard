const nodemailer = require("nodemailer");
const Log4n = require('./log4n.js');
const smtp = require('../config/smtp.js');
const server = require('../config/server.js');

module.exports = function (receiver, subject, messageHTML, messageText) {
    const log4n = new Log4n('/utils/sendMail');
    log4n.object(receiver, 'receiver');
    log4n.object(subject, 'subject');
    log4n.object(messageHTML, 'messageHTML');
    log4n.object(messageText, 'messageText');

    return new Promise((resolve, reject) => {
        let transporter;
        log4n.debug('transporter initialisation');
        transporter = nodemailer.createTransport(smtp.transport);

        log4n.debug('set mail options');
        let mailOptions = {
            from: '"' + server.sender + '" <' + server.email + '>',
            to: receiver,
            subject: subject,
            html: messageHTML,
            text: messageText
        };
        // log4n.object(mailOptions, 'mailOptions');

        // send mail with defined transport object
        log4n.debug('send mail');
        transporter.sendMail(mailOptions)
            .then(result => {
                log4n.object(result, 'result');
                log4n.debug('close transporter');
                transporter.close();
                resolve(result.response);
            })
            .catch(error => {
                log4n.object(error, 'Error');
                if (typeof transporter !== 'undefined') {
                    log4n.debug('close transporter');
                    transporter.close();
                }
                reject(error);
            });
    })
};
