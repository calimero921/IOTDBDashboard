/* jslint node: true */
/* jslint esversion: 6 */
/* jshint -W117 */

'use strict';

const Log4n = require('./log4n');
const checkJSON = require('./checkJSON');

module.exports = function (response, messages) {
	const log4n = new Log4n('/router/util/decodeResponse');
	

	//décodage en HTML
	if(isHTML(response)) {
		log4n.debug('decoding HTML');
		return parseHTML(response, log4n);
	}

	//décodage en XML
	if(isXML(response)) {
		log4n.debug('sending XML');
		return response;
	}

	//décodage en JSON
	if(isJSON(response)) {
		log4n.debug('decoding JSON');
		return parseJSON(response);
	}
	
	log4n.debug('sending RAW');
	return response;
};

function isJSON(response) {
	return response.startsWith("[") || response.startsWith("{");

}

function parseJSON(content) {
    const log4n = new Log4n('/router/util/decodeResponse/parseJSON');
    

    const result = JSON.parse(content);
	let error;

	if(typeof result.code !== 'undefined') {
	    if(typeof error === 'undefined') error= {};
		error.code = result.code;
		result.code = {};
	}
	if(typeof result.type !== 'undefined') {
        if(typeof error === 'undefined') error= {};
		error.type = result.type;
		result.type = {};
	}
	if(typeof result.message !== 'undefined') {
        if(typeof error === 'undefined') error= {};
		error.message = result.message;
		result.message = {};
	}

	if(typeof error !== 'undefined') result.error = error;
	
	// log4n.object(result, "result");
	return result;
}	

function isXML(response) {
	return response.startsWith("<?xml");
}

function isHTML(response) {
	return response.startsWith("<!DOCTYPE html>");
}

function parseHTML(content) {
	let result = {};
	let error;
	
	const log4n = new Log4n('/router/util/decodeResponse/parseHTML');
	
	
	let body = getSection(content, "body");
//	log4n.debug("body:" + body);
	
	const h1 = getSection(body, "h1");
//	log4n.debug("h1:" + h1);
	if(h1.length > 0) {
		body = removeSection(body, "h1");
//		log4n.debug("body:" + body);
		if(h1.startsWith("HTTP Status")) {
			error.code = h1.substr(12,3);
			let p = getSection(body, "p");
//			log4n.debug("p:" + p);
			while (p.length > 0) {
				body = removeSection(body, "p");
//				log4n.debug("body:" + body);
			
				const b = getSection(p, "b");
//				log4n.debug("b:" + b);
			
				if(b.length > 0) {
					switch(b) {
					case "type":
						error.type = removeSection(p, "b").trim();
						break;
					case "message":
						error.message = getSection(p, "u").trim();
						break;
					case "description":
						error.description = getSection(p, "u").trim();
						break;
					default:
						break;
					}
				}
				p = getSection(body, "p");
//				log4n.debug("p:" + p);
			}
		}
	}

	if(typeof result === 'undefined') {
		error.code = "500";
		error.message = "Internal server error";
	}

    if(typeof error !== 'undefined') result.error = error;

    // log4n.object(result, "result");
	return result;
}

function getSection(content, section) {
	let start = content.indexOf("<" + section + ">");
	if(start > -1) {
		start = start + section.length + 2;
		const stop = content.indexOf("</" + section + ">");
		if(stop > -1) return content.substring(start, stop);
	}
	return "";
}

function removeSection(content, section) {
	let result = "";
	let start = content.indexOf("<" + section + ">");
	if(start > -1) {
		result = content.substring(0, start);
		start = start + section.length + 2;
		const stop = content.indexOf("</" + section + ">");
		if(stop > -1) return result + content.substring(stop + section.length + 3);
	}
	return result;
}
