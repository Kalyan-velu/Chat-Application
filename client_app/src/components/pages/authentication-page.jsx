import React, { Suspense, useEffect } from "react";
import { Box, Container, Typography, styled } from "@mui/material";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import { useNavigate } from "react-router-dom";

const Register = React.lazy(
  () => import("@/components/pages/pageComponents/authentication/login"),
);
const Login = React.lazy(
  () => import("@/components/pages/pageComponents/authentication/login"),
);

const blue = {
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const Tab = styled(TabUnstyled)`
  font-family: "IBM Plex Sans", sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  width: 120px;
  padding: 10px 0;
  margin: 6px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${blue[500]};
    transform: translateY(-2px);
  }

  &.${tabUnstyledClasses.selected} {
    background: linear-gradient(90deg, ${blue[400]}, ${blue[600]});
    color: #fff;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabsList = styled(TabsListUnstyled)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${blue[700]};
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 20px;
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
`;

export default function AuthenticationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (user) navigate("/app/chats");
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Monoton, cursive",
            background: "linear-gradient(90deg,#0072E5,#3399FF)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          LChat
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#0f112d",
          borderRadius: 3,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          p: 4,
        }}
      >
        <TabsUnstyled defaultValue={0}>
          <TabsList>
            <Tab>Sign Up</Tab>
            <Tab>Log In</Tab>
          </TabsList>

          <Suspense
            fallback={<Typography align="center">Loading...</Typography>}
          >
            <TabPanel value={0}>
              <Register />
            </TabPanel>
            <TabPanel value={1}>
              <Login />
            </TabPanel>
          </Suspense>
        </TabsUnstyled>
      </Box>
    </Container>
  );
}
