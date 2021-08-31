const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes/userRoute')
var path = require('path');
var cookieParser = require('cookie-parser');
const cors =require('cors')


app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/BusDetails",{useNewUrlParser: true, useUnifiedTopology: true },
)

const db = mongoose.connection;
db.on('error', () => {
    console.log("Something went wrong!!");
})
db.once('open', () => {
    console.log("Connected to the DB");
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.send("Hello")
})
app.use('/users',routes)



app.listen('5000',(req,res)=>{
    console.log("Server started...")
})