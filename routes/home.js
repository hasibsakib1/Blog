const express = require('express');
const router = express.Router();
const {dashboard,profile,createBlog,getBlog,upvote,downvote,deleteBlog,getEditProfile,editProfile,openCreateBlogPage,uploadImage,comment,getTimeLine,notifyChange,reportToAdmin,userProfile,getUserTimeLine,editBlog,getEditBlog} = require('../controllers/home');
const {isUserAuthenticated,isSuspended,isAccountDeleted}= require('../middleware/auth');

router.route('/').get(isUserAuthenticated,isAccountDeleted,dashboard);
router.route('/').post(isUserAuthenticated,dashboard);
router.route('/profile').get(isUserAuthenticated,isAccountDeleted,profile);
router.route('/profile_edit').get(isUserAuthenticated,isAccountDeleted,getEditProfile);
router.route('/profile_edit').post(isUserAuthenticated,isAccountDeleted,editProfile);
router.route('/userprofile/:id').get(isUserAuthenticated,isAccountDeleted,userProfile);
router.route('/create').get(isUserAuthenticated,isAccountDeleted,isSuspended,openCreateBlogPage);
router.route('/create').post(isUserAuthenticated,createBlog);
router.route('/edit/:id').post(isUserAuthenticated,editBlog);
router.route('/edit/:id').get(isUserAuthenticated,getEditBlog);
router.route('/upload').post(uploadImage);
router.route('/notify-change').post(isUserAuthenticated,notifyChange);
router.route('/blog/:id').get(isUserAuthenticated,isAccountDeleted,getBlog);
router.route('/blogdelete/:id').delete(isUserAuthenticated,deleteBlog);
router.route('/blog/:id/comment').post(isUserAuthenticated,comment);
router.route('/blog/:id/upvote').post(isUserAuthenticated,upvote);
router.route('/blog/:id/downvote').post(isUserAuthenticated,downvote);
router.route('/timeline').get(isUserAuthenticated,getTimeLine);
router.route('/timeline/:id').get(isUserAuthenticated,getUserTimeLine);
router.route('/report/:report_by/:report_to/:blogId').post(isUserAuthenticated,reportToAdmin);


 
module.exports = router;