import * as React from "react";
import Box from "@mui/system/Box";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import TextField from "@mui/material/TextField";
import { useChats } from "@/components/context/ChatProvider";
import Typography from "@mui/material/Typography";
import { authInstance, chatInstance } from "@/config/axios";
import Button from "@mui/material/Button";
import UserListItem from "../../../lists/UserList";
import UserBadgeItem from "../../../lists/UserBadgeItem";
import { Tooltip } from "@mui/material";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 400,
  bgcolor: "#fff",
  p: 2,
  px: 4,
  pb: 3,
};

export default function NewGroup() {
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);

  const { user, chats, setChats } = useChats();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /*
   * Handling Search
   */
  async function handleSearch(query) {
    setSearch(query);
    if (!query) {
      console.log("No Query");
    }
    try {
      setLoading(true);
      const response = await authInstance.get(`?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(`Search:${response.data}`);
      setLoading(false);
      setSearchResults(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(`HandleSearch:${e}`);
    }
  }

  /*
   *Submitting Users To Create a New Group Chat
   */
  async function handleSubmit() {
    if (!groupName || !selectedUsers) {
    }
    try {
      const response = await chatInstance.post(
        `/group`,
        {
          groupname: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      setChats([response.data, ...chats]);
      console.log(`Chats:${chats}`);
    } catch (e) {
      console.log(`HandleSubmit:${e}`);
    }
  }

  /*
	Handling Deleting Chips
	*/
  function handleDelete(detUser) {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== detUser._id));
  }

  /*
   *Handling SearchResults
   */
  function handleGroup(userToAdd) {
    if (selectedUsers.includes(userToAdd)) {
      console.log("Already Added");
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  return (
    <>
      <Tooltip title={"Create Group"}>
        <Button
          color={"inherit"}
          onClick={handleOpen}
          variant={"outlined"}
          disableElevation
        >
          New Group
        </Button>
      </Tooltip>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <Typography varient={"h1"} id="unstyled-modal-title">
            <b>Create New Group</b>
          </Typography>
          <Box display="flex" flexDirection={"column"}>
            <TextField
              margin={"dense"}
              variant={"outlined"}
              label={"Group Name"}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <TextField
              margin={"dense"}
              variant={"outlined"}
              label={"Add Users "}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Box>

          <Box display={"flex"} flexWrap={"wrap"}>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                user={u}
                key={user._id}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>

          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResults
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}

          <Box display="flex" justifyItems={"flex-end"}>
            <div style={{ flexGrow: "1" }} />
            <Button loading={loading} onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Box>
      </StyledModal>
    </>
  );
}
