const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(`mongodb+srv://${process.env.DB_Username}:${process.env.DB_Password}@cluster0.gbp9zgz.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    console.log('Connected successfully');
});

//create a schema for users

const userSchema = new mongoose.Schema({
    name: {
        type:Object,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    todo: [{ 
        type:String  
    }]

    
})



//model

const collection = new mongoose.model('Users', userSchema);

//const todoCollection = new mongoose.model('')

module.exports= collection;
//module.exports


