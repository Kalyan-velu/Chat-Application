const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (require, response) => {
  const { username, phoneNumber, password, pic } = require.body;

  if (!username || !phoneNumber || !password) {
    return response.status(400).json({
      message: "Please fill all the fields",
    });
  }
  const userExists = await User.findOne({ phoneNumber });
  if (userExists) {
    response.status(400).json({
      message: "User already exists",
    });
    return;
  }
  const user = await User.create({
    username,
    phoneNumber,
    password,
    pic,
  });

  if (user) {
    response.status(200).json({
      _id: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      pic: user.pic,
      token: generateToken(user._id),
      message: "User created successfully",
    });
  } else {
    response.status(401).json({
      message: "User not created",
    });
  }
  return;
};

const authUser = async (require, response) => {
  const { phoneNumber, password } = require.body;

  const user = await User.findOne({ phoneNumber });
  if (user && (await user.matchPassword(password))) {
    response.status(200).json({
      _id: user._id,
      username: user.username,
      phoneNumber: user.phoneNumber,
      pic: user.pic,
      token: generateToken(user._id),
      message: "Taking You to our app",
    });
  } else {
    response.status(400).json({
      message: "Unable to login ! Please Check your Credentials",
    });
  }
};

const allUsers = async (request, respond) => {
  const keyword = request.query.search
    ? {
        $or: [
          {
            //matching patterns with  regex
            username: { $regex: request.query.search, $options: "i" },
          },
          {
            phoneNumber: { $regex: request.query.search, $options: "i" },
          },
        ],
      }
    : {};
  //Not to show current logged-in User
  const users = await User.find(keyword).find({
    _id: { $ne: request.user._id },
  });
  respond.send(users);
  return;
};

module.exports = {
  registerUser: expressAsyncHandler(registerUser),
  authUser: expressAsyncHandler(authUser),
  allUsers: expressAsyncHandler(allUsers),
};
