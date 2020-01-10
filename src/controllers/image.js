const path = require('path');
const { randomString } = require('../helpers/libs');
const fs = require('fs-extra');
const { Image } = require('../models');
const ctrl = {}

ctrl.index = async (req, res) => {
    const image = await Image.findOne({ filename: {$regex: req.params.image_id} });
    res.render('image', { image })
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
                });
                
                const imageSaved = await newImage.save();
                res.redirect(`/images/${imageUrl}`)
            } else {
            
                await fs.unlink(imageTempPath);
                res.status(500).json({ error: 'Only Images are Allowed' });
            }

        }
    }

    saveImage();
}

ctrl.like = (req, res) => {

}

ctrl.comment = (req, res) => {

}

ctrl.remove = (req, res) => {

}

module.exports = ctrl;