import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { alpha, styled } from "@mui/material/styles";
import LoadingButton from "@mui/material/button";
import InputBase from "@mui/material/InputBase";
import { Icon } from "@iconify-icon/react";
import { ChatState } from "../../../context/ChatProvider";
import { authInstance, chatInstance } from "@/config/axios";
import ChatLoading from "../loading/ChatLoading";
import UserListItem from "../lists/UserList";
import { purple } from "@mui/material/colors";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "30px",
  backgroundColor: alpha(theme.palette.common.white, 0.7),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 1),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
    borderRadius: "30px",
  },
}));

const style = {
  backgroundColor: "#ECF1F2",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 250,
  border: "1px solid #5325g",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};

const ColorButton = styled(LoadingButton)(() => ({
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[200],
  },
}));

export default function SearchModal(props) {
  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  const { setSelectedChat, user, chats, setChats } = ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = async () => {
    if (!search) {
      props.setOpenE(true);
      props.setError("Please Enter Something");
      setOpen(false);
    }

    try {
      setLoading(true);

      const response = await authInstance.get(`?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLoading(false);
      setSearchResults(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const accessChat = async (userId) => {
    console.log(userId);
    try {
      const response = await chatInstance.post(
        `/`,
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      if (!chats.find((c) => c._id === response.data._id))
        setChats([response.data, ...chats]);
      setSelectedChat(response.data);
      handleClose();
    } catch (e) {
      props.setOpenE(true);
      props.setError(e`Unable to create`);
    }
  };

  return (
    <div>
      <Search onClick={handleOpen}>
        <SearchIconWrapper>
          <Icon icon="ic:twotone-search" width="24" height="24" />
        </SearchIconWrapper>
        <StyledInputBase
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search or Start a new chat...."
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Search>
            <SearchIconWrapper>
              <SearchTwoTone />
            </SearchIconWrapper>
            <StyledInputBase
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search or start a new chat..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <div
            style={{
              display: "grid",
              justifyContent: "center",
              marginTop: "22px",
            }}
          >
            <ColorButton loading={loading} onClick={handleSearch}>
              Search
            </ColorButton>
          </div>

          <Box
            sx={{
              width: "300px",
            }}
          >
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  onClose={handleClose}
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
