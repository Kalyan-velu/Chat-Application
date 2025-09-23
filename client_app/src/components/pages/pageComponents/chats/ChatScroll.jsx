import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import { useChats } from "../../../context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/config/ChatLog";
import { format } from "date-fns/format";
import Stack from "@mui/material/Stack";
const ScrollableChat = ({ messages }) => {
  const { user } = useChats();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isSender = m.sender._id === user._id;
          return (
            <Box
              key={m._id}
              display="flex"
              justifyContent={isSender ? "flex-end" : "flex-start"}
              alignItems="flex-start"
              mb={isSameUser(messages, m, i, user._id) ? 0.5 : 1.5}
            >
              {!isSender && (
                <Tooltip title={m.sender.username} placement="bottom-start">
                  <Avatar
                    src={m.sender.pic}
                    alt={m.sender.username}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                </Tooltip>
              )}
              <Stack spacing={1}>
                <Box
                  sx={{
                    // maxWidth: "70%",
                    px: 2,
                    py: 1,
                    // borderRadius: 10,
                    borderTopLeftRadius: isSender ? 10 : 0,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: isSender ? 0 : 10,
                    backgroundColor: "secondary.main",
                    // ml: isSender
                    //   ? 0
                    //   : isSameSenderMargin(messages, m, i, user._id),
                    textAlign: "left",
                    wordBreak: "break-word",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight={"400"}>
                    {m.content}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ alignSelf: "end" }}
                  color="text.secondary"
                >
                  {format(new Date(m.createdAt), "hh:mm a dd MMM")}
                </Typography>
              </Stack>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
