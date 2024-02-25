const User = require('../models/UserModel');
const Chat = require('../models/ChatModel')
const generateToken = require('../config/generateToken')

const registerUser = async (req, res, next) => {

    const { name, email, password, picture } = req.body;

    if (!name || !email || !password) {
        res.status(401);
        return res.status(400).json("Enter all the required info")
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json("User Already Exists")
    }

    const newUser = new User({
        name,
        email,
        password,
        picture,
    })
    newUser.save();

    if (newUser) {
        res.status(200).json("Sign Up successful, Please Login now")
    }
    else {
        res.status(500).json("Not able to register the user")
    }
}

const getUser = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (user)
        return res.status(200).json(user)
    else
        res.status(401).json("User Doesn't Exist")
}

const authUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password, user.password)) {
        res.status(200).json({ user, token: generateToken(user._id) })
    }
    else {
        res.status(401).json("Incorrect Username or Password");
    }
}

module.exports = { authUser, getUser, registerUser }