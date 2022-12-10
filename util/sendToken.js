const sendToken=(user,statusCode,res) => {

    const token =user.getJwtToken()

    const options = {
        expires: new Date(
            Date.now() +process.env.COOKIEEXPIRETIME*24*60*60*1000,
        ),
        httpOnly:true
    }

    res.cookie('token',token,options)
    res.redirect('http://localhost:3000/')
    
}

module.exports =sendToken;