import React from "react";
import { Avatar, Chip } from "@mui/material";
import Stack from "@mui/material/Stack";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Stack direction="row" spacing={1}>
      <Chip
        sx={{
          padding: "4px",
          margin: "1px",
        }}
        avatar={<Avatar alt={user.username} src={user.pic} />}
        label={user.username}
        color="info"
        onDelete={handleFunction}
        varient={"outlined"}
      />
    </Stack>
  );
};

export default UserBadgeItem;
