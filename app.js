const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt');
require('dotenv').config();
const collection = require('./dbconnection');
//const todoCollection = require('./todocreation');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//console.log(process.env.DB_Username);
//const RedisStore = require('connect-redis')(session);
const redis = require('redis');


const app= express();
//const redisClient = redis.createClient();
//use json
//app.use(express.json());
//clear

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false
}));

app.get('/',(req,res)=>{
    //res.sendFile(path.join(__dirname, '..', 'Frontend', 'signin.html'));
    res.render('signin');
})

app.get('/signup',(req,res)=>{
    //res.sendFile(path.join(__dirname, '..', 'Frontend', 'signup.html'));
    res.render('signup');
})

//app.get('/')
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
        req.session.userTodo = {todo:check.todo};
        //console.log(req.session.user);
      //return res.sendFile(path.join(__dirname,'..','Frontend','home.html'));
      //res.render('home',{ user: req.session.user, userTodo: req.session.userTodo });
      res.redirect('home');
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
       return res.redirect('signin');
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
         todo: req.body.todo,
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
           // console.log(createTodo);
            //req.session.userTodo.push(list.todo);
            const getUpdatedTodo = await collection.findOne({name: list.name});
            req.session.userTodo = {todo:getUpdatedTodo.todo};
            console.log(req.session.userTodo, 'Updated todo');
            res.render('home',{ user: req.session.user, userTodo: req.session.userTodo});
        } 
        else {
            res.status(404);
        }
    
    //const createTodo = await todoCollection.insertMany(list);
    //return res.send(`added to the list`);
}catch(err) {
    console.log(err);
    return res.send('Something went wrong');
    
}

})

//Delete todos

app.post('/delete',async (req,res)=>{
    try{
         const userName= req.session.user.name;
         const todo= req.body.todo;

          console.log(todo);
        
       const removeTodo = await collection.updateOne(
        {name:userName},
        { $pull:{todo:todo} }
       )
       if (removeTodo.modifiedCount > 0) {

        const getUpdatedTodo = await collection.findOne({name: userName});
         req.session.userTodo = {todo:getUpdatedTodo.todo};
         res.render('home',{ user: req.session.user, userTodo: req.session.userTodo});
         console.log(req.session.userTodo, 'Updated todo');
          console.log('deleted');
           
            } else {
           //res.status(404).send("Todo not found or already deleted");
        console.log('problem');
    }

}catch(err){
        console.log(err);
       res.send("Something went wrong");
    }
})

app.get('/home', (req,res)=>{
    res.render('home',{ user: req.session.user, userTodo: req.session.userTodo});
})



app.listen(3000, ()=>{
    console.log('server running');
})

