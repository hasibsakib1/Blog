const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema = mongoose.Schema({
    avatar:{
        type: String,
        required: [true,"Please add an avatar"]
    },
    name:{
        type:String,
        required: [true, "Please add a name"]
    },
    email:{
        type:String,
        required: [true, "Please add email"],
        unique: true
    },
    password:{
        type:String,
        required: [true, "Please add a password"]
    },
    profession:{
        type:String,
        required: [true, "Please add your profession"]
    },
    timeLine:[
        {
            day:{
                type:Number,
            },
            month:{
                type:Number,
            },
            year:{
                type:Number,
            },
            post:{
                type:Number,
                default:0
            }

        }
    ],
    topic:[
        {
            category:{
                type:String,
            },
            
            total:{
                type:Number,
                default:0
            }
        }
    ],
    totalNotification:{
        type:Number,
        default:0
    },
    notifications:[
        {
            from:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            message:{
                type:String
            }
        }
    ],
    admin:{
        type:Boolean,
        default:false
    },
    warning:{
        check:{
        type:Boolean,
        default:false
        },
        message:{
            type:String,
        }
    },
    suspend:{
        check:{
        type:Boolean,
        default:false,
        },
        message:{
            type:String
        }
    }
});

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getJwtToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRECT,{
        expiresIn:process.env.JWTEXPIRETIME
    })
}

module.exports = mongoose.model('User', userSchema);