const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const user = require("../model/user");
//////////////////////////////////////////////////////////////////////////////////////
//存储头像图片
(function(){
    //设置磁盘存储文件,指定文件存储位置和文件名
    let storage = multer.diskStorage({
        //该为存储照片的文件夹
        destination: function (req, file, cb) {
            console.log(file);
            //cb为回调函数,file是multer解析上传文件形成的对象
            cb(null, path.join(__dirname,"../static/userPhoto"));
        },
        //该为照片的命名
        filename: function (req, file, cb) {
            let fileName = req.session._id + file.originalname.match(/(\.(jpe?g|png|gif|webp)$)/)[0];//[0]指的是大括号匹配的内
            console.log(fileName);
            cb(null, fileName)//重新命名的照片
        }
    })


//规定上传的一些参数
    let upload = multer({
        storage:storage,//规定存储方式,上面定义的存储方式
        limits:{//规定文件的各种限制
            fileSize:1024 * 300 //限制大小不超过3ook
        },
        fileFilter(req,file,cb) {//文件过滤,cb(null,false)表示拒绝上传文件,true表示接受上传文件
            cb(null,/\.(jpe?g|png|gif|webp)$/);
        }
    }).single("file");//接收一个名为file的上传文件，所上传的文件会被保存在req.file,即file才有信息




    router.post("/photo",(req,res)=>{
        if (req.session.ifLogin) {
            //使用upload
            upload(req,res,function(err) {
                if(err) {
                    //这里是处理上传的图片不符合limite限制时报的错
                    if(err instanceof multer.MulterError) {
                        res.send({code:8,msg:err.message});
                    } else{
                        res.send({code:8,msg:"上传失败"});
                    }

                } else {
                    //将新头像的名称添加进数据库,新头像的名称存储在了req.file.filename里
                    user
                        .updateOne(
                            {_id:req.session._id},//查找条件
                            {photo:req.file.filename}//更新内容
                        )
                        .then(()=>{
                            deletePho(req.session._id,req.file.filename.match(/(\.(jpe?g|png|gif|webp)$)/)[0]);
                            res.send({code:0,msg:"上传成功"});
                        })
                        .catch((err)=>{
                            res.send({code:2,msg:"服务器异常"});
                        })

                }
            });
        } else{
            res.send({code:4,msg:"登录超时,请重新登录"})
        }
    })

})()

function deletePho(_id,photoTail){
    [".jpg",".jpeg",".png",".gif"].forEach((item)=>{
        if(photoTail === item) {
            return;
        } else{
            //删除其他不同后缀名的头像
            fs.unlink(path.join(__dirname,"../static/userPhoto",_id+item),(err)=>{});
        }
    })
}





//////////////////////////////////////////////////////////////////////////////////
//存储发表文章的图片
(function(){
    //设置磁盘存储文件,指定文件存储位置和文件名
    let storage = multer.diskStorage({
        //该为存储照片的文件夹
        destination: function (req, file, cb) {
            console.log(file);
            //cb为回调函数,file是multer解析上传文件形成的对象
            cb(null, path.join(__dirname,"../static/article"));
        },
        //该为照片的命名
        filename: function (req, file, cb) {
            let fileName = new Date().getTime()+file.originalname.match(/(\.(jpe?g|png|gif|webp)$)/)[0];
            console.log(fileName);
            cb(null, fileName)//重新命名的照片
        }
    })


//规定上传的一些参数
    let upload = multer({
        storage:storage,//规定存储方式,上面定义的存储方式
        fileFilter(req,file,cb) {//文件过滤,cb(null,false)表示拒绝上传文件,true表示接受上传文件
            cb(null,/\.(jpe?g|png|gif|webp)$/);
        }
    }).single("file");//接收一个名为file的上传文件，所上传的文件会被保存在req.file,即file才有信息



    router.post("/articlePhoto",(req,res)=>{
        if (req.session.ifLogin) {
            //使用upload
            upload(req,res,function(err) {
                if(err) {
                    //这里是处理上传的图片不符合limite限制时报的错
                    if(err instanceof multer.MulterError) {
                        res.send({code:8,msg:err.message});
                    } else{
                        res.send({code:8,msg:"上传失败"});
                    }

                } else {
                    //不需要保存在数据库
                    //返回给前端,利用富文本编辑器显示

                        res.send({
                            code:0
                            ,msg:"上传成功"
                            ,data:{
                                "src":"/article/"+req.file.filename
                            }});
                }
            });
        } else{
            res.send({code:5, msg:"登录超时,请重新登录"});
        }
    })

})();




module.exports = router;

