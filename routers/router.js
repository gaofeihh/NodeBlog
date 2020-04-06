const express = require("express");

//调用router
let router = express.Router();

//router的使用同app一样
router.get("/",(req,res) => {
    res.send("");
});

module.exports = router;
