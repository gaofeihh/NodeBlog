const crypto = require("crypto");
// 建立用户信息表
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
        user:{
                type:String,
                required:true,
                match:/^[\w\u4e00-\u9fa5]{2,10}$/
        },
        pwd:{
                type:String,
                required: true,
                match:/^[\S]{6,12}$/
        },
        sex:{
                type:String
        },
        phone:{
                type:String,
                match:/^1[3-9]\d{9}$/
        },
        email:{
                type:String,
                match:/^1\w{2,}@[\\da-z]{2,}(\.[a-z]{2,6}){1,2}$/i
        },
        status:{
                type:String,
                default:"我就是我,不一样的烟花"
        },
        photo:{
                type:String,
                default:"1.jpg"
        }


})

//添加中间件,用于密码加密
userSchema.pre("save",function(next) {
        //this是传递过来的数据
        //底下为加密的固定写法,update里为要加密的数据
        this.pwd = crypto.createHash("sha256").update(this.pwd).digest("hex");
        next();
})

module.exports = mongoose.model("user",userSchema);

