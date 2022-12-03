const { isAuthenticated } = require("../../isAuthenticated");
const { createQueue } = require("../config/rabbitmq");
const { ProductModel } = require("../model/product");
const {pushToQueueOrder} = require('../../order-service/config/rabbitmq')

const productRouter = require("express").Router();
/**
 * @swagger
 *  tags :
 *      name : User-productRouter
 *      description : User-Auth Section
 */
/**
 * @swagger
 * /create:
 *  post:
 *          tags : [User-productRouter]
 *          summary: Create New User
 *          description: Add An User In DataBase
 *          parameters:
 *          -   name: name
 *              description: enter name
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: desc
 *              description: enter email
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: price
 *              description: enter password
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorization
 *              500:
 *                  description: Internal Server Error
 */
productRouter.post("/create", async (req, res, next) => {
    try {
        const { name, desc, price } = req.body;
        const newProduct = new ProductModel({
            name, desc, price
        })
        await newProduct.save();
        return res.json({
            message: 'new Product Added',
            pruduct: newProduct
        })
    } catch (error) {
        next(error)
    }
});
productRouter.post("/buy", isAuthenticated, async (req, res, next) => {
    const { productIDs = [] } = req.body;
    const products = await ProductModel.find({ _id: { $in: productIDs } })
    const { email } = req.user;
    console.log(email,productIDs)
    await pushToQueueOrder("ORDER", { products, userEmail: email });
    const channel = await createQueue('PORODUCT');
    channel.consume('PORODUCT', msg => {
        console.log(JSON.parse(msg.content.toString()));
    })
    return res.json({
        message:"aaaa"
    })

});
module.exports = {
    productRouter
}