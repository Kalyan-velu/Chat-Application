import React, { lazy, Suspense } from "react";
import lottie from "lottie-web";
import loading from "../../animations/progress-bar.json";
import { ChatState } from "../context/ChatProvider";
import { Container, Grid } from "@mui/material";

const MyChats = lazy(() => import("./pageComponents/chats/MyChats"));
const ChatBox = lazy(() => import("./pageComponents/chats/ChatBox"));
const Navigation = lazy(() => import("../navigation/Navigation"));

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = React.useState(false);

  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#suspens"),
      animationData: loading,
      loop: true,
    });
  }, []);
  return (
    <Container
      style={{
        padding: 2,
      }}
      maxWidth={"xl"}
      fixed
    >
      {user && (
        <Grid container spacing={1}>
          <Suspense fallback={<div />}>
            <Grid item xs={3}>
              <Navigation />
              <MyChats
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                user={user}
              />
            </Grid>
            <Grid item xs={9}>
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Grid>
          </Suspense>
        </Grid>
      )}
    </Container>
  );
};
export default ChatPage;
