const path = require('path');
const { randomString } = require('../helpers/libs');
const fs = require('fs-extra');
const { Image, Comment } = require('../models');
const md5 = require('md5');
const sidebar = require('../helpers/Sidebar');
const ctrl = {}

ctrl.index = async (req, res) => {
    let viewModel = { image: {}, comments: {} };
    const image = await Image.findOne({ filename: {$regex: req.params.image_id} });

    if (image) {
        image.views += 1;
        viewModel.image = image;
        await image.save();
        const comments = await Comment.find({ image_id: image._id });
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel)
    }
    else {
        res.redirect('/')
    }
}

ctrl.create = (req, res) => {

    const saveImage = async () => {

        const imageUrl = randomString();
        const images = await Image.find({ filename: imageUrl });

        if (images.length > 0) {
            
            saveImage();
        
        } else {

            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imageUrl}${ext}`);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImage = new Image({
                    title: req.body.title,
                    filename: imageUrl + ext,
                    description: req.body.description,
                    user: req.user.email
                });
                await newImage.save();
                res.redirect(`/images/${imageUrl}`)
            } else {
            
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only Images are Allowed' });
            }

        }
    }

    saveImage();
}

ctrl.like = async (req, res) => {
    const image = await Image.findOne({ filename: {$regex: req.params.image_id} });
    if (image){
        image.likes += 1;
        await image.save();
        res.json({ likes: image.likes}) 
    }
    else {
        res.status(500).json({ error: 'Internal Error' })
    }
}

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({ filename: {$regex: req.params.image_id} });
    
    if (image) {
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        newComment.save();
        res.redirect(`/images/${image.uniqueId}`)
    }
    else {
        res.redirect('/')
    }
}

ctrl.remove = async (req, res) => {

    const authUser = req.user;
    let imageUser;

    if (authUser){
        imageUser = await Image.findOne({ user: authUser.email})
    }
    
    
    if (imageUser) {
        
        const image = await Image.findOne({ filename: {$regex: req.params.image_id} });
        
        if (image) {
            await fs.unlink(path.resolve(`./src/public/upload/${image.filename}`));
            await Comment.deleteMany({ image_id: image._id });
            await image.remove();
            res.json(true);
        }

    }
    
}

module.exports = ctrl;