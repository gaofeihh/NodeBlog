const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author:{type:Schema.Types.ObjectId,required:true,ref:"user"},
    date:{type:Date,default:Date.now},
    content:{type:String,require:true},
    //评论的评论
    comment:[{type:Schema.Types.ObjectId,ref:"comment"}]
})

module.exports = mongoose.model("comment",commentSchema);