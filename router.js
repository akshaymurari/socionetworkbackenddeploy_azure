const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const db = require("./database/connect");

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/verify/:token", async (req, res) => {
  try {
    let token = req.params["token"];
    const result =  jwt.verify(token, process.env.secretkey);
    result.password = await bcrypt.hash(result.password,10); 
    if (result) {
        const data = await db.users.create({
            username:result.username,
            email:result.email,
            password:result.password
        });
        return res.redirect(process.env.clienturl);
    } else {
      return res.status(400).send("error");
    }
  } catch(error) {
    return res.status(400).send("error");
  }
});

router.post("/signup", (req, res) => {
  return require("./Controllers/register").register(req, res, db);
});

router.post("/signin", (req, res) => {
    return require("./Controllers/signin").signin(req,res,db);
});

router.post("/googlelogin", (req,res) => {
    return require("./Controllers/signin").googlesignin(req,res,db);
});

router.post("/getposts",(req,res)=>{
  return require("./Controllers/posts").getposts(req,res,db);
})

router.post("/addposts",(req,res)=>{
  return require("./Controllers/posts").addposts(req,res,db);
})

router.post("/profilepic",(req,res)=>{
  return require("./Controllers/profile").profilepic(req,res,db);
})

router.post("/getprofilepic",(req,res)=>{
  return require("./Controllers/profile").getprofilepic(req,res,db);
})

router.post("/onsearch",(req,res)=>{
  return require("./Controllers/profile").onsearch(req,res,db);
})

router.post("/follow",(req,res)=>{
  return require("./Controllers/following").follow(req,res,db);
})

router.post("/getfollowingstatus",(req,res)=>{
  return require("./Controllers/following").getfollowingstatus(req,res,db);
})

router.post("/getfollowing",(req,res)=>{
  return require("./Controllers/following").getfollowing(req,res,db);
})

router.post("/getourfollowing",(req,res)=>{
  return require("./Controllers/following").getourfollowing(req,res,db);
})

router.post("/getprofile",(req,res) => {
  return require("./Controllers/profile").getprofile(req,res,db);
})

router.post("/like",(req,res)=>{
  return require("./Controllers/likes").like(req,res,db);
})

router.post("/unlike",(req,res)=>{
  return require("./Controllers/likes").unlike(req,res,db);
})

router.post("/comment",(req,res)=>{
  return require("./Controllers/comment").comment(req,res,db);
})

router.post("/getcomments",(req,res)=>{
  return require("./Controllers/comment").getcomments(req,res,db);
})

router.post("/deletepost",(req,res)=>{
  return require("./Controllers/posts").deletepost(req,res,db);
})

router.post("/followingposts",(req,res)=>{
  return require("./Controllers/posts").followingposts(req,res,db);
});

router.post("/getfollowersorfollowing",(req,res)=>{
  return require("./Controllers/following").getfollowersorfollowing(req,res,db);
});

router.post("/getmychats",(req,res)=>{
  return require("./Controllers/chat").getmychats(req,res,db);
})

module.exports = router;
