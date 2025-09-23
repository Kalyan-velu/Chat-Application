import React, { memo, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useChats } from "../../../context/ChatProvider";
import { chatInstance } from "@/config/axios";
import ChatLoading from "../loading/ChatLoading";
import { getSender } from "@/config/ChatLog";
import NewGroup from "./messages/groupChat/NewGroup";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MyChats({ fetchAgain }) {
  const [openE, setOpenE] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loggedUser, setLoggedUser] = React.useState();
  const { user, chats, selectedChat, setChats } = useChats();

  const handleClose = () => setOpenE(false);

  const fetchChats = async () => {
    try {
      const response = await chatInstance.get(`/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(response.data);
    } catch (e) {
      setOpenE(true);
      setError("Failed to load chat");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          height: "100%",
          borderRadius: "0 0 0 10px",
          overflow: "hidden",
        }}
      >
        {/* Header Row */}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          px={2}
          // py={1.5}
          // borderBottom="1px solid"
          // borderColor="divider"
        >
          <NewGroup />
        </Box>

        {/* Chat List */}
        <Box flex={1} overflow="auto">
          {chats ? (
            <Stack spacing={0}>
              {chats.map((chat, index) => (
                <React.Fragment key={chat._id}>
                  <ChatItem
                    chat={chat}
                    chatName={
                      !chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName
                    }
                    isSelected={selectedChat?._id === chat._id}
                  />
                  {index < chats.length - 1 && <Divider variant="fullWidth" />}
                </React.Fragment>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Stack>

      {/* Error Snackbar */}
      {error && (
        <Snackbar open={openE} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

const ChatItem = memo(({ chat, chatName, isSelected }) => {
  const { setSelectedChat } = useChats();
  return (
    <Box
      onClick={() => setSelectedChat(chat)}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1.5,
        cursor: "pointer",
        bgcolor: isSelected ? "action.selected" : "transparent",
        borderRadius: 2,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        transition: "background-color 0.2s",
      }}
    >
      <Avatar
        src={!chat.isGroupChat ? chat.users[1]?.pic : ""}
        alt={chatName}
        sx={{ width: 40, height: 40, mr: 2 }}
      />
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {chatName}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap width="200px">
          {chat.latestMessage
            ? `${chat.latestMessage.sender.username}: ${chat.latestMessage.content}`
            : "No messages yet"}
        </Typography>
      </Box>
    </Box>
  );
});
ChatItem.displayName = "ChatItem";
