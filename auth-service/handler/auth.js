const { UserModel } = require("../model/user");
const jwt = require('jsonwebtoken')
const authRouter = require("express").Router();
/**
 * @swagger
 *  tags :
 *      name : User-Authentication
 *      description : User-Auth Section
 */
/**
 * @swagger
 * /register:
 *  post:
 *          tags : [User-Authentication]
 *          summary: Create New User
 *          description: Add An User In DataBase
 *          parameters:
 *          -   name: name
 *              description: enter name
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: email
 *              description: enter email
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: password
 *              description: enter password
 *              in: formData
 *              required: true
 *              type: string
 *              format : password
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
authRouter.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await UserModel.findOne({ email });
        if (existUser) throw { message: "user already exist" }
        const newUser = new UserModel({
            name, email, password
        })
        await newUser.save();
        return res.json({
            message: 'new user Added'
        })
    } catch (error) {
        next(error)
    }
});
/**
* @swagger
* /login:
*  post:
*          tags : [User-Authentication]
*          summary: Create New User
*          description: Add An User In DataBase
*          parameters:
*          -   name: email
*              description: enter email
*              in: formData
*              required: true
*              type: string
*          -   name: password
*              description: enter password
*              in: formData
*              required: true
*              type: string
*              format : password
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
authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existUser = await UserModel.findOne({ email }, { __v: 0 });
        if (!existUser) throw { message: "user not found" }
        if (existUser.password != password) throw { message: "user or pass is wrong" }
        delete existUser.password;
        jwt.sign({ email, id: existUser._id, name: existUser.name }, "secretKey", (err, token) => {
            if (!err) {
                console.log('aaaaa')
                return res.json({ token })
                
            }
            return res.json({ error: err.message })
        })
    } catch (error) {
        next(error)
    }
});
module.exports = {
    authRouter
}