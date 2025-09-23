import * as React from "react";
import { useChats } from "@/components/context/ChatProvider";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import { Grid, IconButton, Paper, TextField } from "@mui/material";
import { getSender, getSenderFull } from "@/config/ChatLog";
import UserProfileModal from "../../../profile/UserProfileModal";
import GroupModal from "../../../profile/GroupModal";
import { messageInstance } from "@/config/axios";
import ChatScroll from "../../ChatScroll";
import { io } from "socket.io-client";
import GiF from "../../../../../../animations/Welcome";
import { Icon } from "@iconify-icon/react";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";

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
    useChats();

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
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          flexGrow={1}
          maxHeight={"calc(100dvh - 6.5rem)"}
          p={0}
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
              <Paper
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newMessage) sendMessage({ key: "Enter" });
                }}
                sx={(theme) => ({
                  mt: 1,
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 4,
                  boxShadow: 1,
                  border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.2)}`,
                })}
              >
                <InputBase
                  sx={{ ml: 4, flex: 1 }}
                  placeholder="Type a message..."
                  multiline
                  maxRows={4}
                  value={newMessage}
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.key === "Enter") {
                      sendMessage(e);
                    }
                  }}
                  onChange={typingHandler}
                />
                <IconButton
                  type={"submit"}
                  color="primary.contrastText"
                  sx={{ p: "10px" }}
                  onClick={() => newMessage && sendMessage({ key: "Enter" })}
                >
                  <Icon icon="mdi:send" />
                </IconButton>
              </Paper>
            </div>
          )}
        </Box>
      ) : (
        <Stack
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <GiF style={{ borderRadius: "1.3rem", overflow: "clip" }} />
          <Typography variant={"h4"} pb={3}>
            Click on a conversation to start chatting
          </Typography>
        </Stack>
      )}
    </>
  );
};
export default SingleChat;
