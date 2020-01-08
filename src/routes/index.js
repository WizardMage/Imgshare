const router  = require('express').Router();
const home = require('../controllers/home');
const image = require('../controllers/image');

module.exports = app => {
    
    router.get('/', home.index);

    router.get('/images/:images_id', image.index);
    
    router.post('/images/:images_id', image.create);
    
    router.post('/images/:image_id/like', image.like);
    
    router.post('/images/:image_id/comment', image.comment);
    
    router.delete('/image/:image_id', image.remove);

    app.use(router)
}