const jwt=require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

function authmiddleware(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            msg:"invalid user "
        })
    }
    const token=authHeader.split(" ")[1];
    try{
        const decode=jwt.verify(token,JWT_SECRET);

        if(decode.newuserid){
            req.newuserid=decode.newuserid;
        next();
        }
        else{
            res.status(403);
        }
       
    }
    catch(e){
        res.status(403).json({
            msg:"server error"
        })
    }
}

module.exports={
    authmiddleware
}