const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
require('dotenv').config();
const collection = require('./dbconnection');
console.log(process.env.DB_Username);

const app= express();
//use json
app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'..','Frontend')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'signin.html'));
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'signup.html'));
})

app.post('/signin',(req,res)=>{
    const signinData ={
        username:req.body.username,
        password:req.body.password
    }


})

app.listen(3000, ()=>{
    console.log('server running');
})

