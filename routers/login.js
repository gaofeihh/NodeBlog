const crypto = require("crypto");
const user = require("../model/user.js");

module.exports = function (req,res) {
    let data = req.body;
    //与数据库进行匹配
    //因为存在数据库里的密码是加密的,所以登录的密码也需要加密,才能进行匹配
    let pwd  = crypto.createHash("sha256").update(data.pwd).digest("hex");
    user.findOne({
        user:data.user
    }).then((data)=>{//data为查询结果
        if(data) {//用户名存在
            //之所以不在后端进行直接跳转,在前端利用location再到后端进行跳转是因为
           if(data.pwd === pwd) {
               //设置cookie
               req.session.ifLogin = true;
               //再次添加id,方便个人信息的展示
               req.session._id = data.id;
               console.log(req.session._id);
               res.send({code:0,msg:"登录成功"});
           } else{
               res.send({code:1,msg:"密码错误"});
           }

        } else{
            res.send({code:2,msg:"用户不存在"});
        }
    }).catch(()=>{
        res.send({code:3,msg:"服务器出问题了,请重试"});
    })
}