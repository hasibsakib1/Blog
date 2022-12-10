const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
    report_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    report_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog' 
    },
    approve:{
        type:Boolean,
        default:false
    },
    isWarnningSent:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Report', ReportSchema);