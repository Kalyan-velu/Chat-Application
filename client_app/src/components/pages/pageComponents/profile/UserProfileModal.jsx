import * as React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { Icon } from "@iconify-icon/react";

export default function UserProfileModal({ user }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    width: { xs: "90%", sm: 400 },
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Icon icon="ic:twotone-more-vert" width={24} height={24} />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {/* Avatar */}
          <Avatar
            src={user.pic}
            alt={user.username}
            sx={{ width: 150, height: 150, mb: 2 }}
          />

          {/* Upload Button */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-upload"
            type="file"
          />
          <label htmlFor="profile-upload">
            <Button variant="contained" color="primary" component="span">
              Change Photo
            </Button>
          </label>

          <Divider
            sx={{ width: "100%", my: 2, borderColor: theme.palette.divider }}
          />

          {/* User Info */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              Username
            </Typography>
            <Typography variant="h6">{user.username}</Typography>

            <Typography variant="subtitle1" color="text.secondary" mt={1}>
              Phone Number
            </Typography>
            <Typography variant="h6">{user.phoneNumber}</Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
