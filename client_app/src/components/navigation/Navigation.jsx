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
import { useChats } from "../context/ChatProvider";
import AlertDialog from "./Confirmation";
import { getSender } from "@/config/ChatLog";
import { Icon } from "@iconify-icon/react";
import Stack from "@mui/material/Stack";

export default function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, setSelectedChat, notification, setNotification } = useChats();

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
    <Stack
      direction={"row"}
      sx={{
        alignItems: "center",
        padding: "0 0.6rem",
        borderColor: "primary.contrastText",
        border: "1px solid",
      }}
      borderRadius={"0.8rem"}
    >
      <Stack direction={"row"} spacing={0} sx={{ alignItems: "center" }}>
        <ProfileModal user={user} />
        <Typography
          fontWeight={700}
          variant="h5"
          position={"static"}
          noWrap
          component="div"
        >
          CHATS
        </Typography>
      </Stack>
      <div className="grow" />
      <Stack direction={"row"} spacing={0} sx={{ alignItems: "center" }}>
        <Tooltip title={"Notification"}>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            edge="start"
            color="inherit"
            aria-label={`show ${notification.length} new notifications`}
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
        <AlertDialog />
      </Stack>
      {renderMenu}
    </Stack>
  );
}
