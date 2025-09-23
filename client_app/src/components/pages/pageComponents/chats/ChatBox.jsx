import React from "react";
import SingleChat from "./messages/privateChat/SingleChat";
import { Grid } from "@mui/material";

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  return (
    <Grid
      container
      alignItems={"center"}
      flexDirection={"column"}
      borderRadius={"0 10px 10px 0px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Grid>
  );
}
