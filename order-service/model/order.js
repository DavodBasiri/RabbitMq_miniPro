const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    products : [{_id:String}],
    userEmail : { type: String},
    totalPrice : {type : Number}
},{
    timestamps :true
}
);
module.exports ={
    OrderModel : mongoose.model("order",Schema)
}