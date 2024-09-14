const express=require("express");

const router=express.Router();
const accrouter=require("./account.js")

const userrouter=require("./user.js");

router.use("/user",userrouter);
router.use("/account",accrouter);

module.exports=router;
