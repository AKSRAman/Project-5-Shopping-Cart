const validator = require("email-validator");
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');
const ObjectId = require('mongoose').Types.ObjectId;

// const {Validation} = require
// Validation.bad_request

//---------------------------------------Validation-Function-------------------------------------//

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidMobileNum = function (value) {
    if (!(/^[6-9]\d{9}$/.test(value))) {
        return false
    }
    return true
}

const isValidSyntaxOfEmail = function (value) {
    if (!(validator.validate(value))) {
        return false
    }
    return true
}

const isAlphabet = function (value) {
    let regex = /^[A-Za-z ]+$/
    if (!(regex.test(value))) {
        return false
    }
    return true
}

const isKeyPresent = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isNumber = function (value) {
    let regex = /^[0-9.]+$/
    if (!(regex.test(value))) {
        return false
    }
    return true
}

const isDecimal = function (value) {
    if (!(Number.isInteger(value))) {
        return false
    }
    return true
}

//---------------------------------------API-Validation----------------------------------------//

// i!isValid(fname) || !isValid(lname) || !isValid(lname)

const checkUser = async (req, res, next) => {
    try {
        let files = req.files
        if (!files[0]) {
            return res.status(400).send({ status: false, message: "Please Provide Profile Image" })
        }
        let myData = req.body.data
        if (!myData) { // => added by me now 
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let userBody = JSON.parse(req.body.data)
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data for successful registration" });
        }
        let { fname, lname, email, phone, password, address } = userBody;
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "Please provide fname or fname field" });
        }
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "Please provide lname or lname field" });
        }
        if (!isAlphabet(fname)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in fname" });
        }
        if (!isAlphabet(lname)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in lname" });
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide Email id or email field" });;
        }
        if (!isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "Please provide phone number or phone field" });
        }
        if (!isValidMobileNum(phone)) {
            return res.status(400).send({ status: false, message: '1 Please provide a valid phone number' })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide password or password field" });;
        }
        let size = Object.keys(password.trim()).length
        if (size < 8 || size > 15) {
            return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Please provide address or address field" });;
        }
        let isDBexists = await userModel.find();
        let dbLen = isDBexists.length
        if (dbLen != 0) {
            const DuplicateEmail = await userModel.find({ email: email });
            const emailFound = DuplicateEmail.length;
            if (emailFound != 0) {
                return res.status(400).send({ status: false, message: "This email Id already exists with another user" });
            }
            const duplicatePhone = await userModel.findOne({ phone: phone })
            if (duplicatePhone) {
                return res.status(400).send({ status: false, message: "This phone number already exists with another user" });
            }
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const checkUserupdate = async (req, res, next) => {
    try {
        let myData = req.body.data
        if (!myData) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let userBody = JSON.parse(req.body.data)
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let { fname, lname, email, profileImage, phone, password, address } = userBody;
        if (!isKeyPresent(fname)) {
            return res.status(400).send({ status: false, message: "Please provide fname" });
        }
        if (!isAlphabet(fname)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in fname" });
        }
        if (!isKeyPresent(lname)) {
            return res.status(400).send({ status: false, message: "Please provide lname" });
        }
        if (!isAlphabet(lname)) {
            return res.status(400).send({ status: false, message: "You can't use special character or number in lname" });
        }
        if (!isKeyPresent(email)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (email) {
            if (!isValidSyntaxOfEmail(email)) {
                return res.status(404).send({ status: false, message: "Please provide a valid Email Id" });
            }
        }
        if (!isKeyPresent(phone)) {
            return res.status(400).send({ status: false, message: "Please provide email" });
        }
        if (phone) {
            if (!isValidMobileNum(phone)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid phone number' })
            }
        }
        if (!isKeyPresent(password)) {
            return res.status(400).send({ status: false, message: "Please provide password" });
        }
        if (password) {
            let size = Object.keys(password.trim()).length
            if (size < 8 || size > 15) {
                return res.status(400).send({ status: false, message: "Please provide password with minimum 8 and maximum 14 characters" });;
            }
        }
        if (!isKeyPresent(address)) {
            return res.status(400).send({ status: false, message: "Please provide address" });
        }

        const foundId = await userModel.findOne({ email: email });
        if (foundId) {
            let userId1 = foundId._id
            if (userId1 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicatePhone1 = await userModel.findOne({ phone: phone })
                if (duplicatePhone1) {
                    let userId2 = duplicatePhone1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicatePhone1) {
                        return res.status(400).send({ status: false, message: "This phone number already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }

        const foundId1 = await userModel.findOne({ phone: phone });
        if (foundId1) {
            let userId3 = foundId1._id
            if (userId3 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                const duplicateEmail1 = await userModel.findOne({ email: email })
                if (duplicateEmail1) {
                    let userId2 = duplicateEmail1._id
                    if (userId2 == paramsId) {
                        return next();
                    } else if (duplicateEmail1) {
                        return res.status(400).send({ status: false, message: "This email Id is already exists with another user(1)" });
                    }
                } else {
                    return next();
                }
            }
        }
        const DuplicateEmail = await userModel.find({ email: email });
        const emailFound = DuplicateEmail.length;
        if (emailFound != 0) {
            return res.status(400).send({ status: false, message: "This email Id already exists with another user(2)" });
        }
        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: "This phone number already exists with another user(2)" });
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const checkProduct = async (req, res, next) => {
    try {
        let files = req.files
        if (!files[0]) {
            return res.status(400).send({ status: false, message: "Please Provide Product Image" })
        }
        let myData = req.body.data
        if (!myData) {
            return res.status(400).send({ status: false, message: "Please provide data for successful response" });
        }
        const productBody = JSON.parse(req.body.data)
        if (!isValidRequestBody(productBody)) {
            return res.status(400).send({ status: false, message: "Please provide data to create product" });
        }
        let { title, description, price, productImage, style, availableSizes } = productBody;
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Please provide title or title field" });
        }
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Please provide description or description field" });
        }
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "Please provide price or price field" });;
        }
        if (!isNumber(price)) {
            return res.status(400).send({ status: false, message: "Price should be a number or an integer" });;
        }
        if (!isKeyPresent(availableSizes)) {
            return res.status(400).send({ status: false, message: "Please provide size" });
        }
        let dbExist = await productModel.find();
        let dbLen = dbExist.length
        if (dbLen != 0) {
            const duplicateTitle = await productModel.find({ title: title });
            const titleFound = duplicateTitle.length;
            if (titleFound != 0) {
                return res.status(400).send({ status: false, message: "This title is already exists with another product" });
            }
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const checkProductUpdate = async (req, res, next) => {
    try {
        let myData = req.body.data
        if (!myData) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        const productBody = JSON.parse(req.body.data)
        let paramsId = req.params.productId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!isValidRequestBody(productBody)) {
            return res.status(400).send({ status: false, message: "Please provide data to update" });
        }
        let { title, description, price, productImage, style, availableSizes } = productBody;
        if (!isKeyPresent(title)) {
            return res.status(400).send({ status: false, message: "Please provide title" });
        }
        if (!isKeyPresent(description)) {
            return res.status(400).send({ status: false, message: "Please provide description" });
        }
        // if (!isNumber(price)) {
        //     return res.status(400).send({ status: false, message: "Price should be a number or an integer" });;
        // } // this validation is not working
        if (!isKeyPresent(availableSizes)) {
            return res.status(400).send({ status: false, message: "Please provide size" });
        }
        if (!isKeyPresent(style)) {
            return res.status(400).send({ status: false, message: "Please provide style" });
        }
        const foundId = await productModel.findOne({ title: title });
        if (foundId) {
            let userId1 = foundId._id
            if (userId1 == paramsId) { // here we are checking that if we are the owner of duplicate id then still we are able to update
                return next();
            }
        }
        const duplicateTitle = await productModel.find({ title: title });
        const titleFound = duplicateTitle.length;
        if (titleFound != 0) {
            return res.status(400).send({ status: false, message: "This title is already exists with another product" });
        }
        next();
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const authorizer = async (req, res, next) => {
    try {
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            console.log("authorizer checking paramsId")
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            console.log("authorizer checking authorization")
            return res.status(400).send({ status: false, message: "Sorry you are not authorized to do this action" })
        }
        console.log("authorizer working properly")
        next();
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


const checkOrder = async (req, res, next) => {
    try {
        let paramsId = req.params.userId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
        }
        if (!(req.userId == paramsId)) {
            return res.status(400).send({ message: "Sorry, this orderId does not belongs to you" })
        }
        let productId = req.body.orderId
        let checkId1 = ObjectId.isValid(productId);
        if (!checkId1) {
            return res.status(400).send({ status: false, message: "Please Provide a valid orderId in body" });;
        }
        const orderCheck = await orderModel.findOne({ _id: productId })
        if (!orderCheck) {
            return res.status(400).send({ status: false, message: "Sorry this orderId doesn't exist" });
        }
        if (orderCheck.cancellable == false) {
            return res.status(400).send({ status: false, message: "Sorry, we can't proceed your request as your order is not cancellable" })
        }
        if (orderCheck.isDeleted == true) {
            return res.status(400).send({ status: false, message: "This order has already been cancelled" })
        }
        next();
    }
    catch (err) {
        return res.status(500).send(err.message)
    }
}


module.exports = { checkUser, checkUserupdate, checkProduct, checkProductUpdate, isValidRequestBody, authorizer, checkOrder }