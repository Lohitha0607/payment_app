const express = require("express");

const app=express();
const port=3000;
const mainrouter=require("./routes/index.js")
const cors=require("cors")


app.use(cors());

app.use(express.json());


app.use("/api/v1",mainrouter); 




app.listen(port ,()=>{
    console.log("server listening on port 3000");
})