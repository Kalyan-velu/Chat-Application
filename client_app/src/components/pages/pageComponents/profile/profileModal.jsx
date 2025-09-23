import * as React from "react";
import { useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../../errorBoundary/errorBoundary";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "primary.main",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  width: { xs: "90%", sm: 400 },
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function ProfileModal({ user, trigger, editable }) {
  const [open, setOpen] = useState(false);
  const [usernameChange, setUsernameChange] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const memoizedTrigger = useMemo(() => {
    if (trigger && React.isValidElement(trigger)) {
      return React.cloneElement(trigger, {
        ...trigger.props,
        onClick: () => {
          setOpen(true);
        },
      });
    }
    return (
      <Tooltip title="Account settings">
        <IconButton onClick={handleOpen} size="large">
          <Avatar alt={user.username} src={user.pic} />
        </IconButton>
      </Tooltip>
    );
  }, [trigger, user.username, user.pic]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      {memoizedTrigger}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {/* Avatar */}
          <Avatar
            src={user.pic}
            alt={user.username}
            sx={{ width: 120, height: 120, mb: 2 }}
          />

          {/* Upload Button */}
          {editable && (
            <>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="profile-upload"
                type="file"
                readOnly={!editable}
              />
              <label htmlFor="profile-upload">
                <Button variant="contained" component="span">
                  Upload New Photo
                </Button>
              </label>
            </>
          )}

          <Divider sx={{ width: "100%", my: 2 }} />

          {/* User Info */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              disabled={!editable}
              value={usernameChange || user.username}
              onChange={(e) => setUsernameChange(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={user.phoneNumber}
              disabled
            />
          </Box>

          {/* Optional Save Button */}
          {editable && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => console.log("Save changes clicked")}
            >
              Save Changes
            </Button>
          )}
        </Box>
      </Modal>
    </ErrorBoundary>
  );
}
