const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    console.log("UserId is not sent");
    return response.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    //should satisfy both conditions
    $and: [
      {
        users: { $elemMatch: { $eq: request.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username pic phoneNumber",
  });
  if (isChat.length > 0) {
    response.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [request.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password",
      );
      response.status(200).send(FullChat);
      return;
    } catch (e) {
      console.log(e);
      response.status(400);
      return;
    }
  }
};

const fetchChats = async (request, response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: request.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: " username pic phoneNumber",
        });
        response.status(200).send(results);
      });
  } catch (e) {
    response.status(400);
    throw new Error(e.message);
  }
};

const createGroupChat = async (request, response) => {
  if (!request.body.users || !request.body.groupname) {
    return response.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(request.body.users);
  if (users.length < 2) {
    return response.status(400).send("Add More than two users");
  }
  users.push(request.user);

  try {
    const groupChat = await Chat.create({
      chatName: request.body.groupname,
      users: users,
      isGroupChat: true,
      groupAdmin: request.user,
    });
    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    response.status(200).json(fullGroupChat);
  } catch (e) {
    response.status(400);
    throw new Error(e.message);
  }
};

const renameGroupChat = async (request, response) => {
  const { chatId, chatName } = request.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    response.status(404).json({ message: "Chat Not Found" });
    return;
  } else {
    response.json(updatedChat);
    return;
  }
};

const addToGroup = async (request, response) => {
  const { chatId, userId } = request.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    response.status(404);
    return;
  } else {
    response.json(added);
    return;
  }
};

const removeFromGroup = async (request, response) => {
  const { chatId, userId } = request.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
      },
    },
    { new: true },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    response.status(404).json({ message: "Chat Not Found" });
    return;
  } else {
    response.json(removed);
    return;
  }
};
module.exports = {
  accessChat: expressAsyncHandler(accessChat),
  fetchChats: expressAsyncHandler(fetchChats),
  createGroupChat: expressAsyncHandler(createGroupChat),
  renameGroupChat: expressAsyncHandler(renameGroupChat),
  addToGroup: expressAsyncHandler(addToGroup),
  removeFromGroup: expressAsyncHandler(removeFromGroup),
};
