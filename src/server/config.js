const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const express = require('express');
const routes = require('../routes');
const errorHandler = require('errorhandler');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');


require('../helpers/passport');

module.exports = app => {

    //Settings
    app.set('env', 'development');
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./helpers')
        
    }));
    app.set('view engine', '.hbs');
    
    //Middleware
    //app.use(morgan('dev'));
    app.use(multer({ dest: path.join(__dirname, '../public/upload/temp') }).single('image'));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(session({
        secret: 'imgshare',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    
    //Global Variables
    app.use((req, res, next) => {
        res.locals.success_message = req.flash('success_message');
        res.locals.error_message = req.flash('error_message');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next()
    });
    //Routes
    routes(app);

    //Static Files
    app.use('/public', express.static(path.join(__dirname, '../public')));

    //Errorhandler
    if ('development' === app.get('env')){
        app.use(errorHandler)
    }

    return app
}