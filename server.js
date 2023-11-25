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

app.post('/signin',async (req,res)=>{
    
    //check username 
    //compare password
try{
    const check = await collection.findOne({name:req.body.username});

    if(!check){
        res.send('User Not Found');
    }

    const compare = await bcrypt.compare(req.body.password, check.password);

    if(compare){
        res.sendFile(path.join(__dirname, '..','Frontend','home.html'));
    }
    else{
        res.send('Incorrect password')
    }
} catch {
    res.send('wrong details')
}

})

app.post('/signup', async (req,res)=>{
    const signUpData ={
        name:req.body.username,
        password:req.body.password
    }

    console.log(signUpData.name);

    const userExists = await collection.findOne({name: signUpData.name});

    if(userExists){
        res.send('user already exists, please sign in');
    }
    else 
    { 
        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(signUpData.password, saltRounds);
        signUpData.password = hashedPassword;
        const addUser = await collection.insertMany(signUpData);
        console.log(addUser);
        res.send('User created successfully.');
    }
    

})

app.listen(3000, ()=>{
    console.log('server running');
})

