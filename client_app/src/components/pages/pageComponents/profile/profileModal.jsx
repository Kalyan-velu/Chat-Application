import * as React from "react";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../../errorBoundary/errorBoundary";

const style = {
  position: "absolute",
  display: "grid",
  flexDirection: "column",
  justifyItems: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#f7f6f8",
  width: 400,
  border: "2px solid #blue",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function ProfileModal({ user }) {
  const [open, setOpen] = React.useState(false);
  const [usernameChange, setUsernameChange] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(usernameChange);

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <div>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleOpen}
              size="large"
              edge="start"
              color="inherit"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <Avatar alt={user.username} src={user.pic} />
            </IconButton>
          </Tooltip>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box p={2}>
                <img
                  src={user.pic}
                  width={"200px"}
                  style={{ borderRadius: "50%" }}
                  height={"200px"}
                  alt={user.token}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "3px",
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                  />
                  <label htmlFor="raised-button-file">
                    <Button variant="raised" component="span">
                      Upload
                    </Button>
                  </label>
                </div>
              </Box>
              <Box width={"300px"}>
                <Typography>User Name:-</Typography>
                <TextField
                  fullWidth={true}
                  margin={"dense"}
                  variant={"standard"}
                  placeholder={user.username}
                  onChange={(e) => {
                    setUsernameChange(e.target.value);
                  }}
                />
                <br />
                <Typography>Phone Number:-</Typography>
                <TextField
                  fullWidth={true}
                  margin={"dense"}
                  variant={"standard"}
                  value={user.phoneNumber}
                  disabled
                />
              </Box>
            </Box>
          </Modal>
        </div>
      </ErrorBoundary>
    </>
  );
}
