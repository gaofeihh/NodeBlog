const express = require("express");
const router = express.Router();

const user = require("../model/user");//获取数据库的表

router.use("/",(req,res) =>{
    //先判断是否已经登录,若没有,则不能访问个人中心,直接给其跳回到主页面
    //     每次发出请求,都会自带session
    if(req.session.ifLogin) {
        //得到req.session._id,去查找对应用户的数据,返回给usercenter.ejs
        let id = req.session._id;
        user
            .findById(id)
            .then((data)=>{
                res.render("usercenter",{data});
            })
    } else{

            res.redirect("/");
    //     res.render("index");//不能这样写,这样写,路由是/usercenter,但是页面是首页
    }


})



module.exports = router;