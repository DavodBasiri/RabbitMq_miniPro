const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {type :String },
    desc : { type: String},
    price : {type : String}
},{
    timestamps :true
}
);
module.exports ={
    ProductModel : mongoose.model("product",Schema)
}