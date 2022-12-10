const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    category: {
        type: String,
        required: [true,"Please add category"]
    },
    bannerImage: {
        type: String,
        require: [true, "please add cover photo"]
    },
    title: {
        type: String,
        require: [true, "Please add the blog title"]
    },
    description: {
        type: String,
        require: [true, "Please add description"]
    },
    comments: [{
        content: {
            type: String,
            require: [true, "Please add content"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            require:true,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }

    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    upvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    total_vote:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Blog', BlogSchema);