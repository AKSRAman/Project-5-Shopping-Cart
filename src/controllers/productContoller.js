const productModel = require('../models/productModel');
const ObjectId = require('mongoose').Types.ObjectId;
let aws = require('./aws')


const createProduct = async (req, res) => {
    try {
        let product = JSON.parse(req.body.data)
        let { title, description, style, price, availableSizes } = product;
        let files = req.files
        const productImage = await aws.uploadFile(files[0])
        let currencyId = "INR"
        let currencyFormat = "₹"
        let productCreated = { title, description, price, currencyId, currencyFormat, productImage, style, availableSizes }
        const productCreate = await productModel.create(productCreated);
        return res.status(201).send({ status: true, message: 'Success', data: productCreate });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const productByQuery = async (req, res) => {
    try {
        let myQuery = req.query;
        const { size, name, priceGreaterThan, priceLessThan, priceSort } = myQuery
        if (size || name || priceGreaterThan || priceLessThan) {
            let body = {};
            body.isDeleted = false
            if (size) {
                body.availableSizes = size
            }
            if (name) {
                body.title = { $regex: name }
            }
            if (priceGreaterThan) {
                body.price = { $gt: priceGreaterThan }
            }
            if (priceLessThan) {
                body.price = { $lt: priceLessThan }
            }
            let productFound = await productModel.find(body).sort({ price: priceSort })
            if (!(productFound.length > 0)) {
                return res.status(404).send({ status: false, message: "Sorry, there is no such product found" });
            }
            return res.status(200).send({ status: true, message: 'Query Product list', data: productFound });
        } else {
            let productFound2 = await productModel.find().sort({ price: priceSort })
            return res.status(200).send({ status: true, message: "Success", data: productFound2 });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const productByParams = async (req, res) => {
    try {
        let paramsId = req.params.productId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid productId in path params" });;
        }
        let productFound = await productModel.findOne({ _id: paramsId, isDeleted: false })
        if (!productFound) {
            return res.status(404).send({ status: false, msg: "There is no product exist with this id" });
        }
        return res.status(200).send({ status: true, message: 'Product list', data: productFound });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const updateProductById = async (req, res) => {
    try {
        let paramsId = req.params.productId
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid productId in path params" });;
        }
        let productFound = await productModel.findOne({ _id: paramsId, isDeleted: false })
        if (!productFound) {
            return res.status(404).send({ status: false, msg: "There is no product exist with this id" });
        }
        let updateBody = JSON.parse(req.body.data)
        let files = req.files
        let productImage;
        if (files[0]) {
            productImage = await aws.uploadFile(files[0])
        }
        let { title, description, price, style, availableSizes, installments } = updateBody
        let updateProduct = await productModel.findOneAndUpdate({ _id: paramsId }, { title: title, description: description, price: price, productImage: productImage, style: style, availableSizes: availableSizes, installments: installments }, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: updateProduct });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};


const deleteProductById = async (req, res) => {
    try {
        let paramsId = req.params.productId;
        let checkId = ObjectId.isValid(paramsId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid product Id in path params" });;
        }
        let checkProduct = await productModel.findOne({ _id: paramsId, isDeleted: false });
        if (!checkProduct) {
            return res.status(404).send({ status: false, message: "This product id does not exits" });
        }
        let productFound = await productModel.findOneAndUpdate({ _id: paramsId }, { isDeleted: true, deletedAt: Date() }, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: productFound });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};


module.exports = { createProduct, productByQuery, productByParams, updateProductById, deleteProductById }