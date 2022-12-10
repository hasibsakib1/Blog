const express = require('express');
const router = express.Router();
const {isUserAuthenticated,isAdmin}= require('../middleware/auth');
const {adminPanel,allUsers,allPosts,addKeyword,allReports,suspendUser,deleteUser,deleteBlog,warnUser,approveUser,deleteKeyword}=require('../controllers/admin');

router.route('/').get(isUserAuthenticated,isAdmin,adminPanel);
router.route('/keyword').post(isUserAuthenticated,isAdmin,addKeyword);
router.route('/keyword/:id').delete(isUserAuthenticated,isAdmin,deleteKeyword);
router.route('/users').get(isUserAuthenticated,isAdmin,allUsers);
router.route('/posts').get(isUserAuthenticated,isAdmin,allPosts);
router.route('/reports').get(isUserAuthenticated,isAdmin,allReports);
router.route('/suspend/:userId').post(isUserAuthenticated,isAdmin,suspendUser);
router.route('/report/:id/warning/:userId').post(isUserAuthenticated,isAdmin,warnUser);
router.route('/report/:id/approve/:userId').post(isUserAuthenticated,isAdmin,approveUser);
router.route('/delete/user/:userId').delete(isUserAuthenticated,isAdmin,deleteUser);
router.route('/delete/blog/:blogId').delete(isUserAuthenticated,isAdmin,deleteBlog);


 
module.exports = router;