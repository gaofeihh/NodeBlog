const express = require("express");
const router = express.Router();

const article = require("../model/article");

router.post("/",(req,res)=>{
    let articleData = req.body;
    console.log("这是传递过来的数据"+articleData);
    if(req.session.ifLogin) {
        article
            .create({
                title:articleData.title
                ,tag:articleData.tag
                ,content:articleData.content
                ,author:req.session._id
            })
            .then((data)=>{
                console.log("发表成功")
                res.send({code:0,msg:"发表成功",id:data._id});//把文章id返回,从而让其后面显示文章
            })
            .catch((err)=>{
                console.log(err);
                res.send({code:3,msg:"服务器错误!"});
            })
    } else{
        res.send({code:5,msg:"登录超时"});
    }

})

//处理显示文章页面
router.get("/:id",(req,res)=>{
    console.log("发表文章的id"+req.params);
    article
        .findById(req.params.id).populate("author")
        .then(data=>{
            if(data) {
                res.render("article",{exits:true,data});
            } else {
                console.log(data);
                res.redirect("/404.html");
            }
        })
        .catch(e=>{
            console.log(2);
            res.redirect("/404.html");
        })

});



module.exports = router;