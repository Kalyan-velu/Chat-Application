import * as React from "react";
import { Box, styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Icon } from "@iconify-icon/react";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
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

export default function UserProfileModal({ user }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Icon icon="ic:twotone-more-vert" width="24" height="24" />
      </IconButton>

      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
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
          </Box>
          <Box width={"100%"}>
            Username:
            <Typography
              varient={"h3"}
              sx={{
                fontSize: "23px",
                font: "bold",
              }}
            >
              {user.username}
            </Typography>
            Phone Number:
            <Typography fontSize={"23px"}>{user.phoneNumber}</Typography>
          </Box>
        </Box>
      </StyledModal>
    </div>
  );
}
