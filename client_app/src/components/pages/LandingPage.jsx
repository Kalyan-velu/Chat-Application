import React, { Suspense, useEffect } from "react";
import { Box, styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = React.lazy(
  () => import("./pageComponents/authentication/register"),
);
const Login = React.lazy(() => import("./pageComponents/authentication/login"));

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const Tab = styled(TabUnstyled)`
  font-family:
    IBM Plex Sans,
    sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #0f112d;
    border-radius: 3px;
    outline: 2px solid ${blue[200]};
    outline-offset: 2px;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[100]};
    color: ${blue[800]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const typo = {
  color: "#fff",
  fontFamily: ["Monoton", "cursive"],
};

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family:
    IBM Plex Sans,
    sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: ${blue[700]};
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

export default function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/app/chats");
  }, [navigate]);

  return (
    <>
      <Container maxWidth="sm" fixed>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#0f112d",
            width: "100%",
            height: "80px",
            m: "15px 0 15px 0",
            borderRadius: "10px",
            borderWidth: "1px",
          }}
        >
          <Typography variant={"h3"} sx={typo}>
            LChat
          </Typography>
        </Box>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              backgroundColor: "#0f112d",
              width: "sm",
              p: 3,
              borderRadius: "10px",
              borderWidth: "1px",
            }}
          >
            <TabsUnstyled defaultValue={0}>
              <TabsList>
                <Tab>Sign Up</Tab>
                <Tab>Log In</Tab>
              </TabsList>
              <Suspense fallback={<div>Loading...</div>}>
                <TabPanel value={0}>
                  <Register />
                </TabPanel>
                <TabPanel value={1}>
                  <Login />
                </TabPanel>
              </Suspense>
            </TabsUnstyled>
          </Box>
        </div>
      </Container>
      <></>
    </>
  );
}
