import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./components/context/ChatProvider";
import { ThemeProvider } from "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  shape: {
    borderRadius: 12, // smooth corners for cards, buttons, chat bubbles
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#212121", // main app background
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#29354d", // sidebar, nav, or header
      contrastText: "#e0e0e0",
    },
    background: {
      default: "#181818", // full background
      paper: "#1e1e1e", // surfaces (chat bubbles, modals, cards)
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0", // timestamps, hints, system messages
    },
    success: {
      main: "#4caf50", // delivered/read indicators
    },
    error: {
      main: "#f44336", // failed messages / errors
    },
    warning: {
      main: "#ffa726", // connection warnings
    },
    info: {
      main: "#29b6f6", // notifications
    },
    divider: "#2c2c2c",
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.85rem",
      color: "#b0b0b0", // timestamps
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.05rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // clean flat look
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#29354d", // secondary as header
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#1e1e1e",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        },
      },
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ThemeProvider>,
);
