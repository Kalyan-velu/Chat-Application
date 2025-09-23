import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ChatState } from "../../../context/ChatProvider";
import { Icon } from "@iconify-icon/react";

import { IconButton, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import UserBadgeItem from "../lists/UserBadgeItem";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { authInstance, chatInstance } from "../../../../config/axios";
import UserListItem from "../lists/UserList";

const UpdateButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  height: "30px",
  margin: "22px",
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export default function GroupModal({ fetchAgain, setFetchAgain }) {
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleRename() {
    if (!groupName) {
      return;
    }
    try {
      const response = await chatInstance.put(
        `/group-rename`,
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      console.log(response.data);
      setSelectedChat(response.data);
      setFetchAgain(!fetchAgain);
    } catch (e) {
      console.log(e);
    }
    setGroupName("");
  }

  async function handleSearch(query) {
    setSearch(query);
    if (!query) {
      console.log("No Query");
    }
    try {
      const response = await authInstance.get(`?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLoading(true);
      setSearchResults(response.data);
      console.log(`Search:${response.data}`);
    } catch (e) {
      console.log(`HandleSearch:${e}`);
      setLoading(false);
    }
  }

  async function handleAddMember(user1) {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      console.log("Already added");
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Not an admin");
    }
    try {
      setLoading(true);
      const response = await chatInstance.put(
        `/group-add`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setSelectedChat(response.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
    setGroupName("5");
  }

  async function handleRemove(user1) {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      console.log("only admins can remove");
    }
    try {
      setLoading(true);
      const response = await chatInstance.put(
        `/group-remove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );

      user1._id === user._id ? selectedChat() : setSelectedChat(response.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <div>
      <Tooltip title={"Group Info"}>
        <IconButton variant="outlined" onClick={handleClickOpen}>
          <Icon icon="ic:twotone-more-vert" width="24" height="24" />
        </IconButton>
      </Tooltip>
      <Dialog
        width={"400px"}
        draggable={true}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{
            alignItems: "center",
            paddingLeft: "45%",
          }}
        >
          {selectedChat.chatName}
        </DialogTitle>

        <DialogContent>
          <Typography>Group Members :</Typography>
          <Box maxWidth={"350px"} display={"flex"} flexWrap={"wrap"}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={user._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <Stack marginTop={"20px"} spacing={2} direction="row">
            <TextField
              size={"small"}
              variant={"outlined"}
              value={groupName}
              placeholder={"Update group name"}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <UpdateButton
              size={"small"}
              onClick={handleRename}
              variant={"outlined"}
            >
              Rename
            </UpdateButton>
          </Stack>
          <Stack marginTop={"20px"} spacing={2} direction="row">
            <TextField
              size={"small"}
              variant={"outlined"}
              placeholder={"Add users to group"}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Stack>
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResults
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddMember(user)}
                />
              ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
