import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import lottie from "lottie-web";
import loading from "../src/animations/progress-bar.json";
import ErrorFallback from "./errorBoundary/errorBoundary";
import { ErrorBoundary } from "react-error-boundary";

const ChatPage = React.lazy(() => import("./components/pages/ChatPage"));
const Homepage = React.lazy(() => import("./components/pages/LandingPage"));

function App() {
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#suspense"),
      animationData: loading,
      loop: true,
    });
  }, []);

  return (
    <Suspense
      fallback={
        <div
          id={"suspense"}
          style={{
            display: "grid",
            width: "100%",
            justifyContent: "center",
            height: "100px",
          }}
        />
      }
    >
      <div className="App">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
          <Routes>
            <Route path="/" exact={true} element={<Homepage />} />
            <Route path="/app/chats" element={<ChatPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Suspense>
  );
}

export default App;
