import Button from "@mui/material/Button";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      role="alert"
    >
      <h1 style={{ textAlign: "center" }}>Something Went Wrong</h1>
      <div
        style={{
          padding: "20px",
          margin: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <iframe
          width={"200px"}
          title={"err"}
          src="https://embed.lottiefiles.com/animation/90569"
        />
      </div>
      <div
        style={{
          padding: "20px",
          margin: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          width={"20px"}
          variant={"outlined"}
          size={"small"}
          onClick={resetErrorBoundary}
        >
          Try Again
        </Button>
      </div>
      <div
        style={{
          padding: "20px",
          margin: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p>{error.message}</p>
      </div>
    </div>
  );
}

export default ErrorFallback;
