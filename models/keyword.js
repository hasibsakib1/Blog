const mongoose = require('mongoose');

const keywordSchema = mongoose.Schema({
    name:{
        type:String
    }
});

module.exports = mongoose.model('Keyword', keywordSchema);