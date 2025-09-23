import * as React from "react";
import { ChatState } from "@/components/context/ChatProvider";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import { Grid, IconButton, TextField } from "@mui/material";
import { getSender, getSenderFull } from "@/config/ChatLog";
import UserProfileModal from "../../../profile/UserProfileModal";
import GroupModal from "../../../profile/GroupModal";
import { messageInstance } from "@/config/axios";
import ChatScroll from "../../ChatScroll";
import { io } from "socket.io-client";
import GiF from "../../../../../../animations/Welcome";
import { Icon } from "@iconify-icon/react";

const ENDPOINT = "https://chat-application-server.onrender.com";
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [socketConnected, setSocketConnected] = React.useState(false);
  const { user, notification, setNotification, selectedChat, setSelectedChat } =
    ChatState();

  async function fetchMessages() {
    if (!selectedChat) {
      return console.log("nothing");
    }

    try {
      setLoading(true);
      const response = await messageInstance.get(`/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
      setMessages(response.data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const response = await messageInstance.post(
          "/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );
        socket.emit("new message", response.data);
        setMessages([...messages, response.data]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  React.useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  React.useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  function typingHandler(e) {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    let timeLength = 1000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTyping;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  }

  return (
    <>
      {selectedChat ? (
        <Grid container>
          <div
            style={{
              backgroundColor: "#111",
            }}
          />
          <Box
            width={"100%"}
            height={"63px"}
            display={"flex"}
            bgcolor={"#591980"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <IconButton onClick={() => setSelectedChat("")}>
              <Icon icon="ic:outline-arrow-back-ios" width="24" height="24" />
            </IconButton>

            <div style={{ flexGrow: "1" }} />
            {!selectedChat.isGroupChat ? (
              <>
                <div style={{ flexGrow: "1" }} />
                <Typography fontSize={"20px"}>
                  {getSender(user, selectedChat.users).toUpperCase()}
                </Typography>
                <div style={{ flexGrow: "1" }} />
              </>
            ) : (
              <>
                <div style={{ flexGrow: "1" }} />
                <Typography fontSize={"20px"}>
                  {selectedChat.chatName.toUpperCase()}
                </Typography>
                <div style={{ flexGrow: "1" }} />
              </>
            )}
            <div style={{ flexGrow: "1" }} />
            {!selectedChat.isGroupChat ? (
              <>
                <UserProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                <GroupModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>
          <div
            style={{
              height: "85vh",
              width: "71vw",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"flex-end"}
              width={"100%"}
              height={"100%"}
              p={3}
              bgcolor={"#E8E8E8"}
              style={{ overflowY: "hidden" }}
            >
              {loading ? (
                <div>loading</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                  }}
                >
                  <ChatScroll messages={messages} />
                  {isTyping ? <div>Loading...</div> : null}
                  <TextField
                    variant={"outlined"}
                    margin={"dense"}
                    fullWidth
                    placeholder={"Type a message"}
                    size={"small"}
                    onKeyDown={sendMessage}
                    onChange={typingHandler}
                    value={newMessage}
                  />
                </div>
              )}
            </Box>
          </div>
        </Grid>
      ) : (
        <Box
          alignItems={"center"}
          display="grid"
          paddingTop={"20%"}
          justifyItems={"center"}
        >
          <GiF />
          <Typography variant={"h4"} color={"#0f112d"} pb={3}>
            Click on a conversation to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
