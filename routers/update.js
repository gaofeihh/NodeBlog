//主要处理的是获取个人信息更新的数据,对数据库进行更新
const user = require("../model/user");

module.exports = (req,res) => {
    console.log(req.query);
    let  reqData = req.query;
    if(req.session.ifLogin) {
        //处理要更新的内容
        //对于没有修改的则传过来的是默认值,直接覆盖原来的就可以了
        let data = {
            phone:reqData.phone,
            email:reqData.email,
            status:reqData.status
        }
        //但是性别没有默认值,所以需要进行处理
        reqData.sex && (data.sex = reqData.sex);//如果有,则修改,如果没有则是undefined
        user
            .updateOne({
                _id:req.session._id
            },data)
            .then(()=>{
            })
            .catch(()=>{
                res.send({code:3,msg:"数据错误"});
            })
    } else{
        res.send({code:4,msg:"更新超时"});
    }

}