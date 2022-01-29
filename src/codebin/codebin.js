// const myAws = async (value) => {}

// const func = async (usId, callId) => {
//     setTimeOut(() => {
//         console.log('promise')
//         return 123
//     }, 2000)
// }

// const func2 = async (req, res) => {
//     const usId = req.query.uis;
//     const callId = req.query.callId
//     const data = await func(usId, callId)
// }

//-----------------------------------------------------------------------------//

// const updateOrder = async (req, res) => {
//     try {
//         let paramsId = req.params.userId
//         let checkId = ObjectId.isValid(paramsId);
//         if (!checkId) {
//             return res.status(400).send({ status: false, message: "Please Provide a valid userId in path params" });;
//         }
//         if (!(req.userId == paramsId)) {
//             return res.status(400).send({ message: "You are not authorized to update this order" })
//         }
//         let product = req.body
//       //  if (product.isDeleted==true)
//         let totalPrice = 0
//         let totalQuantity = 0
//         let totalItems = product.items.length
//         for (let i = 0; i < product.items.length; i++) {
//             let demo = await productModel.findOne({ _id: (product.items[i].productId) })
//             totalPrice = totalPrice + (demo.price) * product.items[i].quantity
//             totalQuantity = totalQuantity + Number(product.items[i].quantity)
//         };
//         // Make sure that only a cancellable order could be canceled. Else send an appropriate error message and response.
//         product.totalItems = totalItems
//         product.totalPrice = totalPrice
//         product.userId = paramsId
//         product.totalQuantity = totalQuantity
//         const orderUpdate = await orderModel.findOneAndUpdate({ userId: paramsId, isDeleted: false }, { items: items, totalPrice: totalPrice, totalItems: totalItems, totalQuantity: totalQuantity })
//         return res.status(201).send({ status: true, message: 'Success', data: orderUpdate });
//     }
//     catch (err) {
//         res.status(500).send(err.message)
//     }
// }

//-----------------------------------------------------------------------------//

// My personel MongoDB Database String
// mongodb+srv://AKSRAman:Aman12345@cluster0.oy1o8.mongodb.net/AmanKumar?retryWrites=true&w=majority

//console.log((Math.round(20 * 100) / 100))
// var x = 23;
// console.log(x.toFixed(1));

//-----------------------------------------------------------------------------//



// const updateCart = async (req, res) => {
//     try {
//         let { cartId, productId, removeProduct } = req.body
//         let isDBexists = await cartModel.findOne({ _id: cartId });
//         let len = isDBexists.items.length;
//         for (let i = 0; i < len; i++) {  
//             if (productId == isDBexists.items[i].productId) {   
//                 if (removeProduct == 1) {
//                     let product = await productModel.findOne({ _id: productId }); 
//                     isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(product.price)
//                     isDBexists.items[i].quantity -= 1
//                     if (isDBexists.items[i].quantity == 0) {
//                         isDBexists.items.splice(i, 1)
//                         isDBexists.totalItems -= 1
//                     }
//                     isDBexists.save();
//                 } else {

//                     let product = await productModel.findOne({ _id: productId });
//                     isDBexists.totalPrice = Number(isDBexists.totalPrice) - Number(isDBexists.items[i].quantity) * Number(product.price)
//                     isDBexists.items.splice(i, 1)
//                     isDBexists.totalItems -= 1
//                     isDBexists.save();

//                     if (isDBexists.items.length == 0) {
//                         isDBexists.totalPrice = 0
//                         isDBexists.save();
//                     }
//                 }
//             }
//         }
//         return res.status(200).send({ status: true, message: "success", data: isDBexists })
//     }
//     catch (err) {
//         res.status(500).send(err.message)
//     }
// }



// const createCart = async (req, res) => {
//     try {
//         let paramsId = req.params.userId
//         let isDBexists = await cartModel.findOne({ userId: paramsId });
//         if (!isDBexists) {
//             let cart = req.body
//             let totalPrice = 0
//             let totalItems = cart.items.length;
//             if (totalItems > 1) {
//                 return res.status(400).send({ status: false, msg: "please add one item at a time" });
//             }

//             let demo = await productModel.findOne({ _id: (cart.items.productId), isDeleted: false })
//             totalPrice = totalPrice + (demo.price) * cart.items.quantity

//             cart.userId = paramsId
//             cart.totalItems = totalItems
//             cart.totalPrice = totalPrice
//             const cartCreate = await cartModel.create(cart);
//             return res.status(201).send({ status: true, message: 'Success', data: cartCreate });
//         }
//         else {
//             let cart = req.body
//             let totalItems = cart.items.length;
//             if (totalItems > 1) {
//                 return res.status(400).send({ status: false, msg: "please add one item at a time" });
//             }

//             let Boolean = false;
//             let len = isDBexists.items.length;
//             for (let i = 0; i < len; i++) {
//                 if (cart.items.productId === isDBexists.items[i].productId) {
//                     let product = await productModel.findOne({ _id: cart.items.productId });
//                     isDBexists.price = isDBexists.price + product.price * cart.items.quantity;
//                     isDBexists.totalItems=isDBexists.totalItems+cart.totalItems;
//                     Boolean: true;
//                     isDBexists.save();
                    
//                 }
//             }
//             if(Boolean===false){
//                 isDBexists.items[len+1].push(cart.items);
//                 isDBexists.totalItems=isDBexists.totalItems+cart.totalItems;
//                 isDBexists.price=isDBexists.price+cart.items.quantity*cart.price;
//                 isDBexists.save();
//             }
//             return res.status(200).send({status:false,msg:"successFul",data:isDBexists})
//         }
//     }
//     catch (err) {
//         return res.status(500).send(err.message)
//     }
// }

//------------------------------------------------------------------------------------//
// old order creation api
// let paramsId = req.params.userId
        // let product = req.body
        // let totalPrice = 0
        // let totalQuantity = 0
        // let totalItems = product.items.length
        // for (let i = 0; i < totalItems; i++) {
        //     let demo = await productModel.findOne({ _id: (product.items[i].productId) })
        //     totalPrice = totalPrice + (demo.price) * product.items[i].quantity
        //     totalQuantity = totalQuantity + Number(product.items[i].quantity)
        // };
        // product.userId = paramsId
        // product.totalItems = totalItems
        // product.totalPrice = totalPrice
        // product.userId = paramsId
        // product.totalQuantity = totalQuantity
        // const productCreate = await orderModel.create(product);
        // return res.status(201).send({ status: true, message: 'Success', data: productCreate });

//-----------------------------------------------------------------------------------//
        // get: v => (v / 100).toFixed(2),
        // set: v => v * 100,
        // integer: true, // => added further