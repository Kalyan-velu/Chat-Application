const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

const protect = async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = request.headers.authorization.split(" ")[1];
      //decodes token id
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      request.user = await User.findById(decode.id).select("-password");
      next();
    } catch (e) {
      response.send(e);
      response.status(401);
      throw new Error("Not Authorized,token failed");
    }
  }
  if (!token) {
    response.status(401);
    throw new Error("Not authorized,no token");
  }
};

module.exports = {
  protect: expressAsyncHandler(protect),
};
