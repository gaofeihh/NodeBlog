const express = require("express");
const router = express.Router();
const article = require("../model/article");


//模糊查询---文章名,tag
router.post("/",(req,res)=>{
    let queryInfo = req.body;
    // console.log("传过来的查询数据"+queryInfo.queryArticle);
    let searchData = {};
    //查询条件
    if(queryInfo.queryArticle) {
        searchData = {$or:[
                {title:new RegExp(queryInfo.queryArticle)},
                {tag:{$all:[queryInfo.queryArticle]}}
            ]}

        article
            .find(searchData,{title:1})
            .then((data)=>{
                // console.log("查询结果:"+data);
                res.send(data);
            })
            .catch((e)=>{
                console.log("查询失败"+e);
                res.send();
            })
    } else{
        res.send();
    }

})

module.exports = router;