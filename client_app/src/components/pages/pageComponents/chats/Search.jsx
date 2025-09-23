import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { Icon } from "@iconify-icon/react";
import { useChats } from "../../../context/ChatProvider";
import { authInstance, chatInstance } from "@/config/axios";
import ChatLoading from "../loading/ChatLoading";
import UserListItem from "../lists/UserList";
import { purple } from "@mui/material/colors";
import { Button } from "@mui/material";

// 🔍 Search Wrapper
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 1),
  },
  width: "100%",
  border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.2)}`,
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  boxShadow: theme.shadows[1],
}));

// 🔍 Icon wrapper inside input
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// 📝 Input styling
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  flex: 1,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

// 🎨 Modal style
const modalStyle = {
  backgroundColor: "background.paper",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "95%",
  maxHeight: "80vh",
  borderRadius: "12px",
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

// 🟣 Styled Button
const ColorButton = styled(Button)(() => ({
  backgroundColor: purple[500],
  color: "#fff",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: purple[400],
  },
}));

export default function SearchModal(props) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { setSelectedChat, user, chats, setChats } = useChats();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      props.setOpenE(true);
      props.setError("Please enter something");
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      const response = await authInstance.get(`?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const response = await chatInstance.post(
        `/`,
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      if (!chats.find((c) => c._id === response.data._id)) {
        setChats([response.data, ...chats]);
      }
      setSelectedChat(response.data);
      handleClose();
    } catch (e) {
      props.setOpenE(true);
      props.setError("Unable to create");
    }
  };

  return (
    <Box
      sx={{
        flexGrow: "1",
        maxWidth: "18rem",
        display: "flex",
        height: "fit-content",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <Search
        onClick={() => {
          console.log("Opening Search Modal");
          handleOpen();
        }}
      >
        <SearchIconWrapper>
          <Icon icon="ic:twotone-search" width="22" height="22" />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search chats..."
          inputProps={{ "aria-label": "search" }}
        />
      </Search>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Search>
            <SearchIconWrapper>
              <Icon icon="ic:outline-search" width="22" height="22" />
            </SearchIconWrapper>
            <StyledInputBase
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              inputProps={{ "aria-label": "search" }}
              autoFocus
            />
          </Search>

          <ColorButton loading={loading} onClick={handleSearch}>
            Search
          </ColorButton>

          <Box sx={{ flex: 1, maxHeight: "250px", overflowY: "auto", mt: 1 }}>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((u) => (
                <UserListItem
                  onClose={handleClose}
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
