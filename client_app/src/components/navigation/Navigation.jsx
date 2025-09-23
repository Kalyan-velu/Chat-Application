import React from "react";
import { Box } from "@mui/system";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ProfileModal from "../pages/pageComponents/profile/profileModal";
import { ChatState } from "../context/ChatProvider";
import AlertDialog from "./Confirmation";
import { getSender } from "@/config/ChatLog";
import { Icon } from "@iconify-icon/react";

export default function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, setSelectedChat, notification, setNotification } = ChatState();

  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const menuId = "notification-menu";
  const renderMenu = (
    <Menu
      sx={{ mt: "45px" }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      onClose={handleMenuClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      open={isMenuOpen}
    >
      <MenuList>
        {!notification.length && "No New Messages"}
        {notification.map((notify) => (
          <MenuItem
            onClick={() => {
              setSelectedChat(notify.chat);
              setNotification(notification.filter((n) => n !== notify));
            }}
            key={notify._id}
          >
            <Typography variant={"h4"}>
              {notify.chat.isGroupChat
                ? `${notify.chat.chatName}`
                : `${getSender(user, notify.chat.users)}`}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#591980",
          borderRadius: "10px 0 0 0",
        }}
        fixed
      >
        <Toolbar>
          <ProfileModal user={user} />
          <Typography
            variant="h5"
            position={"static"}
            noWrap
            component="div"
            sx={{
              color: "#fff",
              fontFamily: ["Monoton", "cursive"],
            }}
          >
            Chat
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <div style={{ flexGrow: 1 }} />
          <div>
            <Tooltip title={"Notification"}>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="large"
                edge="start"
                color="inherit"
                aria-label={`show ${notification.length} new notifications`}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={notification.length} color={"error"}>
                  <Icon
                    icon="ic:baseline-notifications-active"
                    width="24"
                    height="24"
                  />
                </Badge>
              </IconButton>
            </Tooltip>
          </div>
          <AlertDialog />
        </Toolbar>
        {renderMenu}
      </Box>
    </div>
  );
}
