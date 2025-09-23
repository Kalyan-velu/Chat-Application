import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useMemo } from "react";
import { useChats } from "@/components/context/ChatProvider";
import { getSender } from "@/config/ChatLog";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ProfileModal from "@/components/pages/pageComponents/profile/profileModal";
import { IconButton } from "@mui/material";
import { Icon } from "@iconify-icon/react";

export default function SelectedChatHeader({ backButton }) {
  const { selectedChat, setSelectedChat } = useChats();
  const chat = useMemo(() => selectedChat, [selectedChat]);
  const chatName = chat
    ? getSender(JSON.parse(localStorage.getItem("userInfo")), chat.users)
    : undefined;
  return !selectedChat ? undefined : (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: backButton ? 0 : 2,
          rowGap: backButton ? 2 : 0,
          py: 1.5,
          cursor: "pointer",
        }}
      >
        {backButton && (
          <IconButton
            onClick={() => {
              setSelectedChat(undefined);
            }}
          >
            <Icon icon="ep:arrow-left" width="24" height="24" />
          </IconButton>
        )}
        <ProfileModal
          trigger={
            <Avatar
              src={!chat.isGroupChat ? chat.users[1]?.pic : ""}
              alt={chatName}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
          }
          user={chat.users[1]}
        />

        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {chatName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {chat.latestMessage
              ? `Last active ${formatDistanceToNow(new Date(chat.latestMessage?.createdAt), { addSuffix: true })}`
              : "No messages yet"}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
