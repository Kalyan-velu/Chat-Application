import Box from "@mui/material/Box";
import { Avatar, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";

const UserButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  border: 0,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
  width: "100%",
  height: 64,
  margin: theme.spacing(1, 0),
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: theme.spacing(1.5),
  textTransform: "none", // keeps original casing
}));

const UserListItem = ({ user, handleFunction }) => {
  return (
    <UserButton onClick={handleFunction}>
      <Avatar
        alt={user.username}
        src={user.pic}
        sx={{
          width: 48,
          height: 48,
          mr: 2,
        }}
      />
      <Box textAlign="left">
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {user.username}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.phoneNumber}
        </Typography>
      </Box>
    </UserButton>
  );
};

export default UserListItem;
