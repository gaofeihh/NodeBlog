//1,判断是否登录,若没有登录,则提示评论失败,请重新登录
//2,需要将数据存入到comment表中
//3,再存到article中
//4,需要考虑评论的回复问题

const express = require("express");
const router = express.Router();
const comment = require("../model/comment");
const article = require("../model/article");


router.post("/",(req,res)=>{
    let reqData = req.body;

    console.log("评论文章"+reqData.articleId);
    console.log("评论内容"+reqData.content);
    if (req.session.ifLogin) {
        comment
            .create({
                author:req.session._id//评论的人
                ,content:reqData.content
            })
            .then((data)=>{
                article
                    .updateOne({
                        _id:reqData.articleId
                    },{//存在文章中的commentid为数组,利用push
                            $push:{comment:data._id}
                     })
                    .then(()=>{
                        console.log("评论保存到文章中成功");
                        res.send({code:0,msg:"评论成功"});
                    })
                    .catch(()=>{
                        console.log("评论保存到文章中失败");
                        res.send({code:1,msg:"服务器错误"});
                    })
            })
            .catch(()=>{
                res.send({code:1,msg:"服务器错误"});
            })



    } else{
        res.send({code:4,msg:"登录超时,请重新登录"})
    }

})


//处理评论的回复
router.post("/respon",(req,res)=>{
    let reqData = req.body;
    console.log("回复的内容"+reqData.respon);
    console.log("评论的id"+reqData.id);
    if(req.session.ifLogin) {
        comment
            .create({
                author:req.session._id,
                content:reqData.respon
            })
            .then((data)=>{
                //将新创建的回复评论id存入到被评论的记录里
                console.log(data._id);
                comment
                    .updateOne({
                        _id:reqData.id//这是被评论的id
                    },{
                        $push:{comment:data._id}//data._id是回复的id
                    }).then(()=>{
                        console.log("成功");
                    }).catch(()=>{console.log("出错")})
            })
            .catch((err)=>{
                console.log("错了");
                console.log(err);
            })
    }else{
        res.send({code:4,msg:"登录失败,请重新登录"})
    }
})

module.exports = router;