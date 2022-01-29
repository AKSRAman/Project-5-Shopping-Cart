const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId;
let aws = require('./aws')

const createUser = async (req, res) => {
    try {
        let userBody = JSON.parse(req.body.data)
        let files = req.files
        const profileImage = await aws.uploadFile(files[0])
        let { fname, lname, email, phone, password, address } = userBody;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        const userData = { fname, lname, email, profileImage, phone, password, address }
        const dataCreated = await userModel.create(userData);
        return res.status(201).send({ status: true, message: 'User created successfully', data: dataCreated });
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const userLogin = async (req, res) => {
    try {
        const myEmail = req.body.email
        const myPassword = req.body.password
        let user = await userModel.findOne({ email: myEmail });
        if (user) {
            const { _id, fname, lname, password } = user
            const validPassword = await bcrypt.compare(myPassword, password);
            if (!validPassword) {
                return res.status(400).send({ message: "Invalid Password" })
            }
            let payload = { userId: _id, email: myEmail };
            const generatedToken = jwt.sign(payload, "the-legends-key", { expiresIn: '10080m' });
            res.header('user-login-key', generatedToken);
            return res.status(200).send({
                status: true,
                message: fname + " " + lname + " you have logged in Succesfully",
                data: {
                    userId: user._id,
                    token: generatedToken,
                }
            });
        } else {
            return res.status(400).send({ status: false, message: "Oops...Invalid credentials" });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


const getuserById = async (req, res) => {
    try {
        const userId = req.params.userId
        let checkId = ObjectId.isValid(userId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        const searchprofile = await userModel.findOne({ _id: userId })
        if (!searchprofile) {
            return res.status(404).send({ status: false, message: 'profile does not exist' })
        }
        const Data = await userModel.find({ _id: userId })
        return res.status(200).send({ status: true, message: 'user profile details', data: Data })
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });
    }
}


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        let checkId = ObjectId.isValid(userId);
        if (!checkId) {
            return res.status(400).send({ status: false, message: "Please Provide a valid userId in query params" });;
        }
        let userBody = JSON.parse(req.body.data)
        let files = req.files
        let profileImage;
        if (files[0]) {
            profileImage = await aws.uploadFile(files[0])
        }
        let { fname, lname, email, password, address } = userBody

        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        let updateAddress = await userModel.findOne({ _id: userId })
        if (!updateAddress) {
            return res.status(400).send({ status: false, message: "This userId does not exist" });;
        }
        updateAddress.address
        if (address) {
            if (address.shipping) {
                if (address.shipping.street) {
                    updateAddress.address.shipping.street = address.shipping.street
                }
                if (address.shipping.city) {
                    updateAddress.address.shipping.city = address.shipping.city
                }
                if (address.shipping.pincode) {
                    updateAddress.address.shipping.pincode = address.shipping.pincode
                }
            }
            if (address.billing) {
                if (address.billing.street) {
                    updateAddress.address.billing.street = address.billing.street
                }
                if (address.billing.city) {
                    updateAddress.address.billing.city = address.billing.city
                }
                if (address.billing.pincode) {
                    updateAddress.address.billing.pincode = address.billing.pincode
                }
            }
        }
        let updateProfile = await userModel.findOneAndUpdate({ _id: userId }, { fname: fname, lname: lname, email: email, password: password, profileImage: profileImage, address: updateAddress.address }, { new: true })
        return res.status(200).send({ status: true, message: "user profile update successfull", data: updateProfile })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = { createUser, userLogin, getuserById, updateProfile }