const express = require("express");
const router = express.Router();

const article = require("../model/article");



router.post("/",(req,res)=>{
    let articleData = req.body;
    if(req.session.ifLogin) {
        article
            .create({
                title:articleData.title
                ,tag:articleData.tag
                ,content:articleData.content
                ,author:req.session._id
            })
            .then((data)=>{
                res.send({code:0,msg:"发表成功",id:data._id});//把文章id返回,从而让其后面显示文章
            })
            .catch((err)=>{
                res.send({code:3,msg:"服务器错误!"});
            })
    } else{
        res.send({code:5,msg:"登录超时"});
    }

})

//处理显示文章页面
router.get("/:id",(req,res)=>{
    //添加评论之后再次修改
    article
        .findById(req.params.id)
        .populate({
            path:"author",//文章作者
            select:["user","_id","photo","status"]
        })
        .populate({
            path:"comment",
            select:["_id","comment","author","content","date"],
            populate:{
                path:"author comment",//评论者
                populate:{
                    path:"author"
                }
            }
        })
        .then(data=>{
            if(data) {
                //需要对文章的pageviews(浏览量)进行添加
                article
                    .updateOne({_id:data._id},{$inc:{pageviews:1}},()=>{})//$inc为自增减操作,正为增,负为减号
                res.render("article",{data});
            } else {
                res.redirect("/404.html");
            }
        })
        .catch(e=>{
            res.redirect("/404.html");
        })


});



module.exports = router;