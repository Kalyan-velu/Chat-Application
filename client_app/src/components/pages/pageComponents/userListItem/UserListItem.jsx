import { Avatar, Box, Typography } from "@mui/material";
import { ChatState } from "../../../context/ChatProvider";

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();
  const style = {
    backgroundColor: "#cea1a1",
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "#111",
  };

  return (
    <>
      <Box onClick={handleFunction} cursor={"pointer"} sx={style}>
        <Avatar mr={2} sizes={"sm"} title={user.username} src={user.pic} />
        <Box>
          <Typography variant={"h3"}>{user.username}</Typography>
          <Typography variant={"h5"}>
            <b>Phone Number :</b>
            {user.phoneNumber}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
