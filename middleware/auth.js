const jwt=require('jsonwebtoken')
const User = require('../models/user')
const Alert=require('alert');

exports.isUserAuthenticated = async(req,res,next)=> {
    const {token} = req.cookies

    if(!token){
        return res.redirect('/auth/login')
    }

    const decode=jwt.verify(token,process.env.JWT_SECRECT)

    req.user=await User.findById(decode.id)
    next()
}

exports.isAdmin = async(req,res,next)=>{
    if(req.user.admin){
        next()
    }
    else{
        return res.redirect('/')
    }
}

exports.isSuspended = async(req,res,next)=>{
    const user = await User.findById(req.user._id)
    if(user.suspend.check){
        Alert('You are suspended. So you can not create blog/article.')
        return res.redirect('/')
        
    }
    else{
        next()
    }
}

exports.isAccountDeleted = async(req,res,next)=>{
    if(!req.user){
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
          });
        res.redirect('/auth/login')
    }
    else{
        next()
    }
}