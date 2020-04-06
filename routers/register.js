const express = require("express");
const router = express.Router();
/*
    code:0 代表成功
    code:1 代表验证错误
    code:2 代表服务器错误
 */

//接收model文件夹创建的user表
const user = require("../model/user.js");

router.use("/",(req,res)=>{ //之前采用post处理,总是冒出找不到register的问题!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let reqData = req.body;
    console.log("进入了register.js");
    console.log(reqData);
    //对传过来的数据进行检查,看数据库是否已经存入
    user
        .findOne({
        user:reqData.user
        })
        .then((data)=>{
            if(data){//存在
                res.send({code:1,msg:"用户已存在"})
            }else{//不存在
                //再判断密码是否一致
                if(reqData.pwd === reqData.pwd2) {
                    //开始存入数据库
                    user.create({
                        user:reqData.user,
                        pwd:reqData.pwd
                    }).then(()=>{//存储成功
                        //设置cookie
                        req.session.ifLogin = true;//过了过期时间就是false了
                        //再次添加id,方便个人信息的展示
                        req.session._id = data.id;
                        res.send({code:0,msg:"注册成功"});
                    }).catch(()=>{
                        res.send({code:2,msg:"服务器异常,请重试(;´༎ຶД༎ຶ`)"})
                    })

                }else{
                    res.send({code:1,msg:"两次密码不一致"})
                }
            }
        })
        .catch((err)=>{
            console.log("注册问题:")
            console.log(err);
            res.send({code:2,msg:"服务器异常,请重试"});
        })


    })

module.exports = router;