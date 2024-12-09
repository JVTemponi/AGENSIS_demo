// config/sessionConfig.js
const session = require('express-session');

module.exports = (app) => {
    app.use(session({
        secret: 'agendaGoogleApi',
        resave: false,
        saveUninitialized: false,
    }));
};
