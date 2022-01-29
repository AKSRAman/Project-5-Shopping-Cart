const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const ObjectId = require('mongoose').Types.ObjectId;

const createCart = async (req, res) => {
    try {
        let paramsId = req.params.userId
        let isDBexists = await cartModel.findOne({ userId: paramsId });
        if (!isDBexists) {
            let cart = req.body
            let totalPrice = 0
            let totalItems = cart.items.length;
            let totalQuantity = cart.items[0].quantity 
            if (totalQuantity < 1) { 
                return res.status(400).send({ status: false, msg: "There is nothing to add in your cart as your total quantity is zero" });
            }
            if (totalItems > 1) {
                return res.status(400).send({ status: false, msg: "please add one item at a time" });
            }
            let demo = await productModel.findOne({ _id: (cart.items[0].productId), isDeleted: false })
            if (!demo) { 
                return res.status(400).send({ status: false, message: "(1). This product is no longer exist" })
            }
            totalPrice = (demo.price) * cart.items[0].quantity
            cart.userId = paramsId
            cart.totalItems = totalItems
            cart.totalPrice = totalPrice
            const cartCreate = await cartModel.create(cart);
            return res.status(201).send({ status: true, message: 'Success', data: cartCreate });
        }
        else {
            let cart = req.body
            let totalItems = cart.items.length;
            let totalQuantity = cart.items[0].quantity 
            if (totalQuantity < 1) { 
                return res.status(400).send({ status: false, msg: "There is nothing to add in your cart as your total quantity is zero" });
            }
            if (totalItems > 1) {
                return res.status(400).send({ status: false, msg: "please add one item at a time" });
            }
            let body = {}
            body.val = 0
            let len = isDBexists.items.length;
            for (let i = 0; i < len; i++) {
                if (cart.items[0].productId == isDBexists.items[i].productId) {
                    let product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                    if (!product) { 
                        return res.status(400).send({ status: false, message: "(2). This product is no longer exist" })
                    }
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) + Number(product.price) * Number(cart.items[0].quantity)
                    isDBexists.items[i].quantity = Number(isDBexists.items[i].quantity) + Number(cart.items[0].quantity)
                    body.val = 1;
                    isDBexists.save();
                }
            }
            if (body.val == 0) {
                let product = await productModel.findOne({ _id: cart.items[0].productId, isDeleted: false }); // => isdeleted added
                if (!product) {
                    return res.status(400).send({ status: false, message: "(3). This product is no longer exist" })
                }
                isDBexists.items.push(cart.items[0]); 
                isDBexists.totalItems += 1 
                isDBexists.totalPrice = isDBexists.totalPrice + Number(cart.items[0].quantity) * product.price;
                isDBexists.save();
            }
            return res.status(200).send({ status: true, msg: "successFul", data: isDBexists })
        }
    }
    catch (err) {
        return res.status(500).send(err.message)
    }
}


const updateCart = async (req, res) => {
    try {
        let { cartId, productId, removeProduct } = req.body
        let checkId1 = ObjectId.isValid(cartId);
        if (!checkId1) { 
            return res.status(400).send({ status: false, message: "Please Provide a valid cartId" });;
        }
        let checkId2 = ObjectId.isValid(productId);
        if (!checkId2) { 
            return res.status(400).send({ status: false, message: "Please Provide a valid productId" });;
        }
        let isDBexists = await cartModel.findOne({ _id: cartId });
        if (!isDBexists) {
            return res.status(400).send({ status: false, message: "This cart id doesn't exist" })
        }
        if (!(req.userId == isDBexists.userId)) { 
            return res.status(400).send({ status: false, message: "This cart is not yours" })
        }
        let len = isDBexists.items.length;
        for (let i = 0; i < len; i++) {  // we are checking that the product that we are sending from request body is exist in our items of cart model 
            if (productId == isDBexists.items[i].productId) {    // the client is suggesting us for decrementation of one quantity of the product from the cart
                if (removeProduct == 1) {
                    let product = await productModel.findOne({ _id: productId, isDeleted: false }); // => isdeleted added
                    if (!product) { 
                        return res.status(400).send({ status: false, message: "(1). This product is no longer exist" })
                    }
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(product.price)
                    isDBexists.items[i].quantity -= 1
                    if (isDBexists.items[i].quantity == 0) {
                        isDBexists.items.splice(i, 1)
                        isDBexists.totalItems -= 1
                    }
                    isDBexists.save();
                    break;
                } else { // the client is suggesting us to remove that particular product from the cart
                    let product = await productModel.findOne({ _id: productId, isDeleted: false });
                    if (!product) { 
                        return res.status(400).send({ status: false, message: "(2). This product is no longer exist" })
                    }
                    isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(isDBexists.items[i].quantity) * Number(product.price)
                    isDBexists.items.splice(i, 1)
                    isDBexists.totalItems -= 1
                    isDBexists.save();
                    if (isDBexists.items.length == 0) {
                        isDBexists.totalPrice = 0
                        isDBexists.save();
                    } break;
                }
            }
        }
        return res.status(200).send({ status: true, message: "success", data: isDBexists })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const getCart = async (req, res) => {
    try {
        let paramsId = req.params.userId
        const cartGet = await cartModel.findOne({ userId: paramsId });
        const cartCheck = cartGet.items.length
        if (cartCheck == 0) {
            return res.status(404).send({ message: "The cart is empty or deleted" })
        } else {
            return res.status(200).send({ status: true, message: 'Success', data: cartGet });
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const deleteCart = async (req, res) => { 
    try {
        let paramsId = req.params.userId
        let items = [];
        let totalPrice = 0
        let totalItems = 0
        const cartGet = await cartModel.findOneAndUpdate({ userId: paramsId }, { items: items, totalPrice: totalPrice, totalItems: totalItems }, { new: true });
        return res.status(204).send({ status: true, message: 'Success', data: cartGet });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


module.exports = { createCart, updateCart, getCart, deleteCart }