import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const MyButton = styled(Button)({
  background: "#EEEFC5",
  "&:hover": {
    background: "#d9c0c0",
  },
  border: 0,
  borderRadius: 9,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "#111",
  width: "100%",
  height: 48,
  marginTop: "20px",
  margin: "10px",
  alignItems: "-moz-initial",
});

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyItems: "left",
      }}
    >
      <MyButton onClick={handleFunction}>
        <Avatar margin={2} size={"sm"} name={user.username} src={user.pic} />
        <Box>
          <Typography varient={"h4"}>
            <b>{user.username}</b>
          </Typography>
          <Typography varient={"h3"}>{user.phoneNumber}</Typography>
        </Box>
      </MyButton>
    </div>
  );
};
export default UserListItem;
