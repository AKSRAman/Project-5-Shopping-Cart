const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

const creatOrder = async (req, res) => {
    try {
        let cartId = req.body.cartId
        let findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) {
            return res.status(400).send({ status: false, message: "This cartId doesn't exist" })
        }
        if (!(req.userId == findCart.userId)) {
            return res.status(400).send({ message: "you are not authorized to do this action" })
        }
        const cartCheck = findCart.items.length
        if (cartCheck == 0) {
            return res.status(404).send({ message: "The cart is empty please add product to proceed your order" })
        }
        let { userId, items, totalPrice, totalItems } = findCart
        let totalQuantity = 0
        let totalItem = items.length
        for (let i = 0; i < totalItem; i++) {
            totalQuantity = totalQuantity + Number(items[i].quantity)
        };
        let myOrder = { userId, items, totalPrice, totalItems, totalQuantity }
        let order = await orderModel.create(myOrder)
        return res.status(201).send({ status: true, message: 'Order placed successfully', data: order });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


const cancelOrder = async (req, res) => {
    try {
        let productId = req.body.orderId
        const orderCancel = await orderModel.findOneAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: Date(), status: "cancelled" }, { new: true })
        return res.status(200).send({ status: true, message: 'Order has been cancelled Successfully', data: orderCancel });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}


module.exports = { creatOrder, cancelOrder }