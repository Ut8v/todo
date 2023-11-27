const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
require('dotenv').config();
const collection = require('./dbconnection');
//const todoCollection = require('./todocreation');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//console.log(process.env.DB_Username);

const app= express();
//use json
//app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'..','Frontend')));

app.use(cookieParser());

app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false
}));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'signin.html'));
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'signup.html'));
})
//sign in
app.post('/signin',async (req,res)=>{
    
    //check username 
    //compare password
try{

    const check = await collection.findOne({name:req.body.username});

    if(!check){
     return res.send('User Not Found');
    }

    const compare = await bcrypt.compare(req.body.password, check.password);
    console.log(compare);

    if(compare){
        req.session.user = {name:check.name};
        console.log(req.session.user);
      return res.sendFile(path.join(__dirname,'..','Frontend','home.html'));
    }
    else{
        return res.send('Incorrect password')
    }
} catch {
  return  res.send('wrong details')
}

})
//signup 
app.post('/signup', async (req,res)=>{

try{
    const signUpData ={
        name:req.body.username,
        password:req.body.password
    }

    //console.log(signUpData.name);

    const userExists = await collection.findOne({name: signUpData.name});

    if(userExists){
      return  res.send('user already exists, please sign in');
    }
    else 
    { 
        //hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(signUpData.password, saltRounds);
        signUpData.password = hashedPassword;
        const addUser = await collection.insertMany(signUpData);
        console.log(addUser);
       return res.send('User created successfully.');
    }
}catch{
  return res.send('Something went wrong')

}
    

})

//to create to do's

app.post('/create', async (req,res)=>{
try {
    const list = {
        // req.session.user = {name:check.name}; 
         name: req.session.user.name,
         todo: req.body.info,
    }

    console.log(list);

    //const checkUser = await collection.findOne({user: list.user});
    const createTodo = await collection.updateOne(
        {name: list.name},
        {$push:{todo: list.todo}},
    )
        //console.log(createTodo);
        if (createTodo.modifiedCount > 0) {
            // If a user was found and updated
            console.log(createTodo);
            return res.send(`Added to the list`);
        } 
    
    //const createTodo = await todoCollection.insertMany(list);
    //return res.send(`added to the list`);
}catch(err) {
    console.log(err);
    return res.send('Something went wrong');
    
}

})


app.listen(3000, ()=>{
    console.log('server running');
})

