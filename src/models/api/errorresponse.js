/**
 * http://usejsdoc.org/
 */

/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const Log4n = require('../util/log4n');

module.exports = function (content, logger) {
    const log4n = new Log4n('/models/api/errorresponse');
    log4n.object(content, 'content');

    logger.object(content, 'content');
	if(typeof content.error === 'undefined') {
        logger.error(content.error);
	} else {
        logger.error(content.error.message);
	}
};
