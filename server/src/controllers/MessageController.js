const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const sendMessage = async (request, response) => {
  const { content, chatId } = request.body;
  if (!chatId || !content) {
    console.log("Invalid data passed into request");
    return response.sendStatus(400);
  }

  var newMessage = {
    sender: request.user._id,
    content: content,
    chat: chatId,
  };
  //Querying data
  try {
    var message = await Message.create(newMessage);
    //populating instance of mongoose
    message = await message.populate("sender", "username pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username  phoneNumber pic",
    });

    await Chat.findByIdAndUpdate(request.body.chatId, {
      latestMessage: message,
    });
    response.json(message);
  } catch (e) {
    console.log(e);
    response.status(400);
    throw new Error(e.message);
  }
};

const allMessages = async (request, response) => {
  try {
    const messages = await Message.find({ chat: request.params.chatId })
      .populate("sender", "username pic phoneNumber")
      .populate("chat");

    response.json(messages);
  } catch (e) {
    console.log(e);
    response.status(400);
  }
};

module.exports = {
  sendMessage: expressAsyncHandler(sendMessage),
  allMessages: expressAsyncHandler(allMessages),
};
