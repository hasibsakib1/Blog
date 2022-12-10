const User= require('../models/user');
const sendToken=require('../util/sendToken');

exports.loginPage= (req, res) => {
    res.render('login')
}

exports.registerPage= (req, res) => {
    res.render('register')
}

exports.loginUser= async (req, res) => {
  try {
    
  
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('error',"Please provide an email and password")
      res.redirect('/auth/login')
      return
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      console.log('error','Email is not valid or please login')
      return res.redirect('/auth/login',{error: 'Email is not valid or please login'})
    }
  
    const isPasswordMatch = await user.comparePassword(password);
  
    if (!isPasswordMatch) {
      console.log('Error','Password is not corrent')
      res.redirect('/auth/login');
      return
    }
  
    sendToken(user, 200, res);
  } catch (error) {
    res.redirect('/auth/login')
    
  }
    
    
}
exports.registerUser= async(req, res) => {
    try {
        const { name, email, password,avatar,profession } = req.body;
    
        const user = await User.findOne({ email });
        if (user)
          return res.redirect('/auth/register',{error: 'User already exists'})
        else {
          const newUser = await User.create({
            name,
            email,
            password,
            avatar,
            profession
          });
    
          sendToken(newUser, 200, res);
          
        }
      } catch (error) {
        res.redirect('/auth/register')
      }
}

exports.logOut= (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.redirect('/auth/login')
}