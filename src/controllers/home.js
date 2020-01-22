const { Image, User } = require('../models')
const sidebar = require('../helpers/Sidebar');
const passport = require('passport');
const ctrl = {}

ctrl.index = async (req, res) => {
    const images = await Image.find().sort({ timestamp: -1 });
    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    res.render('index', viewModel)
}

ctrl.signin = async (req, res) => {
    const images = await Image.find().sort({ timestamp: -1 });
    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    res.render('users/signin', viewModel)
}

ctrl.signup = async (req, res) => {
    const images = await Image.find().sort({ timestamp: -1 });
    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    res.render('users/signup', viewModel)
}

ctrl.postSignin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
});

ctrl.postSignup = async (req , res) => {
    
    const { name, email, password } = req.body;
    const errors = [];

    if(!name || !email || !password) {
        errors.push({ text: 'You must fill in all fields' })
    }

    if(password.length < 5) {
        errors.push({ text: 'The password must have at least seven characters' })
    }

    if (errors.length > 0) {
        res.render('users/signup', { errors } )
    } 

    else {
        const emailUser = await User.findOne({ email: email });
        
        if (emailUser) {
            errors.push({ text: 'Email is already in use' })
            res.render('users/signup' , { errors })
        }
        else {

            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            //await newUser.save();
            req.flash('success_message', 'User registered succesfully');
            res.redirect('/signin')
        
        }
    }
}

ctrl.logout = (req, res) => {
    req.logout();
    res.redirect('/')
}

module.exports = ctrl;