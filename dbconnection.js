const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(`mongodb+srv://${process.env.DB_Username}:${process.env.DB_Password}@cluster0.gbp9zgz.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    console.log('Connected successfully');
});

//create a schema

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    }

})

//model

const model = new mongoose.model('Users', userSchema);

module.exports= model;


