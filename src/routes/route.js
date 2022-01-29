const express = require('express');
const router = express.Router();

//---------------------------selfTest----------------------------//
router.get('/test', (req, res) => {
    res.status(200).send({ status: true, message: "<h1> working properly </h1>" })
})
//---------------------------Project-5---------------------------//
const AWSController = require('../controllers/aws');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const productController = require('../controllers/productContoller');
const userController = require('../controllers/userController');
const myMiddleware = require('../middleWares/middleWare');
const validator = require('../validation/validation');

router.post("/write-file-aws", AWSController.myAws) // 0 - post
router.post('/register', validator.checkUser, userController.createUser) // 1 - post 
router.post('/login', userController.userLogin) // 2 - post 
router.get('/user/:userId/profile', myMiddleware.checkLogin, userController.getuserById) // 3 - get - protected
router.put('/user/:userId/profile', myMiddleware.checkLogin, validator.checkUserupdate, userController.updateProfile) // 4 - put - protected
router.post('/products', validator.checkProduct, productController.createProduct) // 5 - post
router.get('/products', productController.productByQuery) // 6 - get
router.get('/products/:productId', productController.productByParams) // 7 - get 
router.put('/products/:productId', validator.checkProductUpdate, productController.updateProductById) // 8 - put
router.delete('/products/:productId', productController.deleteProductById) // 9 - delete
router.post('/users/:userId/cart', myMiddleware.checkLogin, validator.authorizer, cartController.createCart) // 10 - post - protected
router.put('/users/:userId/cart', myMiddleware.checkLogin, validator.authorizer, cartController.updateCart) // 11 - put - protected
router.get('/users/:userId/cart', myMiddleware.checkLogin, validator.authorizer, cartController.getCart) // 12 - get - protected
router.delete('/users/:userId/cart', myMiddleware.checkLogin, validator.authorizer, cartController.deleteCart) // 13 - delete - protected
router.post('/users/:userId/orders', myMiddleware.checkLogin, validator.authorizer, orderController.creatOrder) // 14 - post - protected
router.put('/users/:userId/orders', myMiddleware.checkLogin, validator.checkOrder, orderController.cancelOrder) // 15 - put - protected

module.exports = router;