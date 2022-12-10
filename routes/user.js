const express = require('express');
const router = express.Router();
const {loginPage,registerPage,loginUser,registerUser,logOut} = require('../controllers/user');

router.route('/login').get(loginPage);
router.route('/login').post(loginUser);
router.route('/register').get(registerPage);
router.route('/register').post(registerUser);
router.route('/logout').get(logOut)

 
module.exports = router;