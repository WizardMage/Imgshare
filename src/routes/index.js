const express = require('express');
const router  = express.Router();

const home = require('../controllers/home');
const image = require('../controllers/image');
const { isAuthenticated } = require('../helpers/libs');

module.exports = app => {
    
    router.get('/', home.index);

    router.get('/signin', home.signin);
    
    router.get('/signup', home.signup);
    
    router.post('/signin', home.postSignin);
    
    router.post('/signup', home.postSignup);

    router.get('/images/:image_id', image.index);
    
    router.post('/images', isAuthenticated, image.create);
    
    router.post('/images/:image_id/like', image.like);
    
    router.post('/images/:image_id/comment', isAuthenticated, image.comment);
    
    router.delete('/image/:image_id', image.remove);
    
    router.get('/logout', home.logout);

    app.use(router)
}