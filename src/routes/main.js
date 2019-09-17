const Log4n = require('../utils/log4n.js');
const server = require('../config/server.js');
const checkAuth = require('./checkAuth.js');

const accountPost = require('./api/account/post.js');
const accountGet = require('./api/account/get.js');
const accountDelete = require('./api/account/delete.js');
const accountPatch = require('./api/account/patch.js');
const accountRecover = require('./api/account/recover');

const accountCheck = require('./api/account/check');
const accountGetByEmail = require('./api/account/getByEmail.js');
const accountGetBySession = require('../models/database/account/getBySession.js');
const accountSetPassword = require('./api/account/setPassword');

const devicePost = require('./api/device/post.js');
const deviceGet = require('./api/device/get.js');
const deviceDelete = require('./api/device/delete.js');
const devicePatch = require('./api/device/patch.js');

//routage des pages
const page_index = require('./index.js');
// const page_signon = require('./signon.js');
// const page_signin = require('./signin.js');
// const page_logout = require('./logout.js');
// const page_recover = require('./recover.js');
// const page_reset = require('./reset.js');
const page_admin_user = require('./admin_user.js');
const page_documentation = require('./docs.js');
const page_device = require('./device.js');

module.exports = function (app, keycloak) {
    const log4n = new Log4n('/routes/main');

    // Routage des pages
    app.get('/logout', (req, res) => {page_index(req, res)});
    app.get('/auth', keycloak.protect("realm:users"), (req, res) => {page_index(req, res)});

    // app.get('/signon', (req, res) => {page_signon(req, res)});
    // app.get('/signin', (req, res) => {page_signin(req, res)});
    // app.get('/recover', (req, res) => {page_recover(req, res)});
    // app.get('/reset/:email/:token', (req, res) => {page_reset(req, res)});
    // app.get('/logout', checkAuth, (req, res) => {page_logout(req, res)});

    app.get('/', (req, res) => {page_index(req, res)});
    app.get('/documentation', keycloak.protect("realm:users"), (req, res) => {page_documentation(req, res)});
    app.get('/device', keycloak.protect("realm:users"), (req, res) => {page_device(req, res)});
    // app.get('/admin/user', keycloak.protect("realm:users"), (req, res) => {page_admin_user(req, res)});
    app.get('/admin/user', keycloak.protect("realm:users", {response_mode: 'token'}), (req, res) => {page_admin_user(req, res)});

    app.get('/status', (req, res) => {res.status(200).send({'last_update':server.date})});

    // routages des API
    app.get('/v1/account/:account_id', keycloak.protect("realm:users"), (req, res) => {accountGet(req, res)});
    app.get('/v1/account/check/:email/:password', (req, res) => {accountCheck(req, res)});
    app.get('/v1/account/recover/:email', (req, res) => {accountRecover(req, res)});
    app.get('/v1/account/email/:email', checkAuth, (req, res) => {accountGetByEmail(req, res)});
    app.post('/v1/account', (req, res) => {accountPost(req, res)});
    app.post('/v1/account/password', (req, res) => {accountSetPassword(req, res);});
    app.delete('/v1/account/:id', checkAuth, (req, res) => {accountDelete(req, res)});

    app.get('/v1/device/:device_id', checkAuth, (req, res) => {deviceGet(req, res)});
    app.post('/v1/device', checkAuth, (req, res) => {devicePost(req, res)});
    app.put('/v1/device/:device_id', checkAuth, (req, res) => {devicePatch(req, res)});
    app.delete('/v1/device/:device_id', checkAuth, (req, res) => {deviceDelete(req, res)});

    log4n.debug('done');
};