import React, { lazy, Suspense, useState } from "react";
import lottie from "lottie-web";
import loading from "../../animations/progress-bar.json";
import { useChats } from "../context/ChatProvider";
import { Container, Grid, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SingleChat from "@/components/pages/pageComponents/chats/messages/privateChat/SingleChat";
import SearchModal from "@/components/pages/pageComponents/chats/Search";
import SelectedChatHeader from "@/components/pages/pageComponents/chats/selected-chat-header";
import { useMediaQuery } from "@mui/system";

const MyChats = lazy(() => import("./pageComponents/chats/MyChats"));
const Navigation = lazy(() => import("../navigation/Navigation"));

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openE, setOpenE] = React.useState(false);
  const [error, setError] = React.useState("");
  const { user, selectedChat } = useChats();
  const [fetchAgain, setFetchAgain] = React.useState(false);

  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#suspens"),
      animationData: loading,
      loop: true,
    });
  }, []);

  const hideChatList = isMobile ? !!selectedChat : false;
  const hideChatbox = isMobile && !selectedChat;
  return (
    user && (
      <Grid
        container
        sx={{
          backgroundColor: "primary.main",
          padding: "0.5rem",
          height: "100dvh",
          width: "100dvw",
        }}
        spacing={2}
        columns={12}
      >
        {!hideChatList && (
          <Grid
            size={{
              xs: 12,
              sm: 5,
              lg: 3,
            }}
          >
            <Stack spacing={3}>
              <Navigation />
              <MyChats
                showSearchBar={!hideChatList && hideChatbox}
                setError={setError}
                setOpenE={setOpenE}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                user={user}
              />
            </Stack>
          </Grid>
        )}

        {!hideChatbox && (
          <Grid
            size={{
              xs: 12,
              sm: 7,
              lg: 9,
            }}
          >
            <Stack height={"100%"} spacing={2} useFlexGap>
              <Stack
                direction={"row"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                useFlexGap
              >
                <SelectedChatHeader backButton={hideChatList && !hideChatbox} />
                {hideChatList && !hideChatbox ? undefined : (
                  <SearchModal
                    setError={setError}
                    setOpenE={setOpenE}
                    user={user}
                  />
                )}
              </Stack>

              <SingleChat
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            </Stack>
          </Grid>
        )}
      </Grid>
    )
  );
};
export default ChatPage;
