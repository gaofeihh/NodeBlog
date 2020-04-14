const express = require("express");
const router = express.Router();
const article = require("../model/article");
const comment = require("../model/comment");

//主要需要考虑的是当删除文章的时候,你同时也需要删除其评论
router.post("/",(req,res)=>{
    console.log("删除传过来的数据"+req.body._id);
    let _id = req.body._id;
    if(req.session.ifLogin) {
        article
            .findById({_id:_id})
            .then((data)=>{
                data.comment.forEach(item=>{
                    //1.删除评论的评论
                    comment
                        .findById({_id:item})
                        .then((data)=>{
                            data.comment.forEach(item=>{
                                comment
                                    .deleteOne({_id:item})
                                    .then(()=>{console.log("删除评论的评论成功");})
                                    .catch(()=>{console.log("删除评论的评论失败");})

                            })
                        })
                        .catch(()=>{console.log("查找文章的评论失败");})

                    //2.再删除评论
                    comment
                        .deleteOne({_id:item})
                        .then(()=>{console.log("删除文章的评论成功")})
                        .catch(()=>{console.log("删除文章的评论失败")})
                })
            })
            .catch(()=>{console.log("查找失败");})
        //3.最后删除文章
        article
            .deleteOne({_id:_id})
            .then(()=>{console.log("删除文章成功");})
            .catch(()=>{console.log("删除文章失败");})



    } else {
        res.send({code:4,msg:"登录超时,请重新登录"});
    }
})

module.exports = router;