const express = require("express");
const router = express.Router();
const user = require("../model/user");
const bus = require('../model/bus')
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  let { name, email, mobile, password } = req.body;
  const userExsist = await user.findOne({ mobile: mobile });
  // console.log(userExsist);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  password = hashPassword;
  // console.log(hashPassword);
  // console.log(password);
  if (userExsist) {
    res.send("User alredy exsit..");
  } else {
    const userCreate = await user.create({ name, email, mobile, password });
    if (userCreate) {
      res.status(200);
      res.json({
        _id: userCreate._id,
        name: userCreate.name,
        email: userCreate.email,
        mobile: userCreate.mobile,
        password: userCreate.password,
      });
    }
  }
});

router.post("/login", async (req, res, next) => {
  const { mobile, password } = req.body;
  const userAuth = await user.findOne({ mobile: mobile });
  // console.log(password, mobile);

  // console.log(mobile);
  // console.log(userAuth);
  if (userAuth) {
    await bcrypt
      .compare(password, userAuth.password)
       .then((result) => {
        if (result) {
          const token = jwt.sign(
            { _id: userAuth._id },
            "secret",
            (err, token) => {
              res.json({
                token: token,
              });
              res.status(200);
              res.send(token);
            }
          );
        } else {
          res.send("");
        }
        })
      .catch((error) => {
        // console.log(error);
        res.send("error");
      });
  } else {
    res.status(404);
    res.json("Error")
    // console.log("Hi");
  }
});

const verifyToken =(req,res,next)=>{
   const token = req.headers['access-token']
   if(!token)
   {
     res.send("We need a token")
   }
   else{
     jwt.verify(token,'secret',(err,decoded)=>{
       if(err)
       {
         res.send("credentials are not correct")

       }
       else{
         res.userId = decoded._id
         console.log(res.userId)
       }
     })
   }
}

router.get('/userDetails',verifyToken,(req,res)=>{
  res.send("Hi")
})

router.post('/search', async(req,res,next)=>{
    const {from,to} = req.body
    const busExsist = await bus.find({from:from,to:to})
    console.log(busExsist)
    if(busExsist)
    {
      res.status(200)
      res.send(busExsist)
    }
})



module.exports = router;
