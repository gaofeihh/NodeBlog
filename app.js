//入口函数---进行与前端的联系,与数据库的连接
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

//处理session保存的模块
const mongooseSession = require("connect-mongo")(session);
const app = express();


//监听端口与路由
app.listen(8888);
// app.use("./",require(path.join(__dirname,"./routers/index")));


//启动数据库
mongoose
    .connect("mongodb://localhost:27017/cy",{useNewUrlParser:true, useUnifiedTopology: true })
    .then(()=>{
        console.log("连接成功")
    })
    .catch(()=>{
        console.log("连接失败")
    })


//中间件
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/static")));

//session中间件
app.use(session({
    secret:"afei",//密钥,可以取任意字符
    cookie:{maxAge:24*60*60*1000},//设置过期时间
    rolling:true,
    store:new mongooseSession({
        url:"mongodb://localhost:27017/blog"
    }),
    resave:false,
    saveUninitialized:false
}));


//引入ejs文件
app.set("view engine","ejs");
app.get("/",require("./routers/index"));


// 监听register路由
// console.log("this is register地址:"+require(path.join(__dirname,"./routers/register")));
// app.post("/",require("./routers/register"));
app.post("/register",require("./routers/register"));

//监听注册之后,跳转的usercenter路由
app.get("/usercenter",require("./routers/usercenter"));

//监听login路由
app.post("/login",require("./routers/login"));

//监听loginout路由
app.get("/loginout",require("./routers/loginout"));

//监听个人信息更新路由
app.get("/update",require("./routers/update"));

//监听上传照片路由
app.use("/upload",require("./routers/upload"));


//监听发表文章路由
app.use("/article",require("./routers/article"));

//监听评论路由
app.use("/comment",require("./routers/comment"));

//监听显示所有文章
app.get("/articleAll",require("./routers/articleAll"));



