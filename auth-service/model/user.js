const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {type :String },
    email : { type: String, required: true, unique: true ,lowercase : true},
    password : {type : String,required :true  }
},{
    timestamps :true
}
);
module.exports ={
    UserModel : mongoose.model("user",Schema)
}