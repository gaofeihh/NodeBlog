const express = require("express");
const router = express.Router();
const article = require("../model/article");

router.get("/",(req,res)=>{
        let reqData = req.query;
        article
            .find()
            .then((data)=>{
                let len = data.length;
                article
                    .find({})
                    .then(data=>{
                        res.render("articleAll",{len});
                    });
            })

})

router.post("/",(req,res)=>{
    let reqData = req.body;
    console.log("传过来的skip"+reqData.skip);
    let skip = reqData.skip - 0;//传过来的skip是字符串,要转为number类型
    article
        .find({},{},{
            limit:5,
            skip:skip
        })
        .then(data=>{
            res.send({data});
        })
        .catch(()=>{
            res.send({});
        })
})
module.exports = router;