const express = require("express");
const article = require("../model/article");
const cheerio = require("cheerio");

//调用router
let router = express.Router();

//router的使用同app一样
router.get("/",(req, res) => {
    //来进行判断,若登录了,则直接显示内容首页,若没有则显示登录块
    if(req.session.ifLogin){

        //筛选出浏览量为前三的文章显示在首页上
        article
            .find({},{},{
            sort:{pageviews:-1},//从大到小排列
            limit:3,
            skip:0
            })
            .then(data=>{
                //对data进行处理,主要是处理content,去掉包含的标签
                let contentData = [];
                data.forEach(item=>{
                //利用cherrio进行虚拟dom操作
                    let $ = cheerio.load(`<p id="articleContent"><%=item.content%></p>`)
                    contentData.push({
                        title:item.title,
                        content:$("#articleContent").text(),
                        date:item.date,
                        pageviews:item.pageviews,
                        comment:item.comment,
                        tag:item.tag,
                        _id:item._id
                    })
                })
                let newData = {
                    contentData:data,
                    bool:true
                }
                console.log(newData);
                res.render("index",{newData});
            })


    }else{
        let newData = {
            bool:false
        }
        res.render("index",{newData});
    }

});

module.exports = router;
