const { port } = process.env;
const Aplication = require("./server");
require('dotenv').config();
const {PORT}=process.env;
new Aplication(PORT,"mongodb://localhost:27017/product-service");