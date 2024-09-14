const express=require("express");
const {authmiddleware}=require("../middleware.js");
const router=express.Router();
const jwt=require("jsonwebtoken");
const {User}=require("../db.js")
const {Amount}=require("../db.js")

const z=require("zod");
const { JWT_SECRET } = require("../config.js");

const signupschema=z.object({
    name:z.string(),
    password:z.string(),
    email: z.string()
    .email({ message: 'Invalid email address' }) 
      

})

const signinschema=z.object({
    email:z.string().email(),
    password:z.string(),

})


router.post("/signup",async (req,res)=>{
     const body=req.body;
     const parsedbody=signupschema.safeParse(body);
     if(!parsedbody.success){
         res.status(411).json({
            msg:"invalid or wrong inputs"
         })
     }

     const thisuser= await User.findOne({
        name:body.name
     })

    if(thisuser){
        return res.json({
            msg:"user already exists"
        })
    }
    const newuser= await User.create(body);
    const newuserid=newuser._id;
    await  Amount.create({
         newuserid,
         balance:(1+Math.random()*10000).toFixed(2),
    })
    const token=jwt.sign({
         newuserid
    },JWT_SECRET)
    res.json({
        msg:"user created",
        token:token
    })


})

router.post("/signin",async (req,res)=>{

    const signinbody=req.body;
    const parsedsigninbody=signinschema.safeParse(signinbody);
    if(!parsedsigninbody.success){
       return res.status(411).json({
           msg:"invalid format for signin"
       })
    }

    const user = await User.findOne({
       email:req.body.email,
       password: req.body.password
   });

   if (user) {
       const token = jwt.sign({
           userid: user._id
       }, JWT_SECRET);

       res.json({
           token: token
       })
       return;
   }


   res.status(411).json({
       message: "Error while logging in"
   })

});


const updateschema=z.object({
    password:z.string().optional(),
    name:z.string().optional()
   
})
router.put("/",authmiddleware,async (req,res)=>{
    const updatenew=req.body;
    const parsedupdatenew=updateschema.safeParse(updatenew);
    if(!parsedupdatenew.success){
        res.status(411).json({
            msg:"invalid inputs for updating"
        })
    }
    await User.updateOne({ _id: req.newuserid }, updatenew);
    res.json({
        msg:"updation successful"
    })
})

router.get("/bulk", authmiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    // Find users whose name matches the filter (case-insensitive)
    const userslist = await User.find({
        name: { "$regex": filter, "$options": "i" } // 'i' makes it case-insensitive
    });

    res.json({
        users: userslist.map((x) => ({
            name: x.name,
            _id: x._id,
        }))
    });
});



module.exports=router;