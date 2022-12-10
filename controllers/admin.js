const User = require('../models/user');
const Blog = require('../models/blog');
const Report = require('../models/report');
const Keyword=require('../models/keyword');

exports.adminPanel= async (req, res) => {
    const totalUsers=await User.countDocuments({});
    const totalPosts=await Blog.countDocuments({});
    const totalReports=await Report.countDocuments({});
    res.render('admin',{user: req.user,totalUsers,totalPosts,totalReports});
}

exports.allUsers=async (req, res) => {
    const users=await User.find({ _id: { $ne: req.user._id } });
    res.render('admin_user',{user: req.user,users})
}

exports.allPosts=async (req, res) => {
    const posts=await Blog.find();
    const keywords=await Keyword.find();
    res.render('admin_post',{user: req.user,posts,keywords})
}

exports.addKeyword=async (req, res) => {
    try {
        const newKeyword=await Keyword.create({name:req.body.keyword});
        res.redirect('/admin/posts')
        
    } catch (error) {
        res.redirect('/admin/posts')
    }
}

exports.deleteKeyword=async (req, res) => {
    const keyword=await Keyword.findById(req.params.id).remove();
    res.json({success:true})
}


exports.allReports=async (req, res) => {
    try {
        const reports=await Report.find().populate('report_by','name email').populate('report_to','name email');
        console.log(reports)
    res.render('admin_report',{user: req.user,reports})
    } catch (error) {
        res.render('/')
    }
    
}

exports.suspendUser=async (req, res) => {
    const id=req.params.userId;
    const message=req.query.message;
    const user=await User.findById(id);
    console.log(user)
    user.suspend.check=!user.suspend.check;
    user.suspend.message=message;
    user.totalNotification+=1;
    user.notifications.push({
        from:req.user._id,
        message:message
    })
    await user.save();
    res.json({success:true})
}

exports.deleteUser=async (req, res) => {
    const user=await User.findById(req.params.userId).remove();
    res.json({success:true})
}

exports.deleteBlog=async (req, res) => {
    const blog=await Blog.findById(req.params.blogId).remove();
    res.json({success:true})
}

exports.warnUser=async (req, res) => {
    const id= req.params.userId;
    const message=req.query.message;
    const reportId=req.params.id;
    const report= await Report.findById(reportId);
    const user = await User.findById(id);
    user.warning.check=true;
    user.warning.message=message;
    user.totalNotification+=1;
    user.notifications.push({
        from:req.user._id,
        message:message
    })
    await user.save();
    report.isWarnningSent=true;
    await report.save();

    res.json({success:true})
}

exports.approveUser=async (req, res) => {
    const id= req.params.userId;
    const message=req.query.message;
    const reportId=req.params.id;
    const report= await Report.findById(reportId);
    const user = await User.findById(id);
    console.log("Approve user",user)

    user.totalNotification+=1;
    user.notifications.push({
        from:req.user._id,
        message:message
    })

    await user.save();
    report.approve=true
    await report.save();

    res.json({success:true})
}