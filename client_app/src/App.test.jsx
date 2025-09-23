import { render, screen } from "@testing-library/react";
import LandingPage from "./components/pages/LandingPage";

test("renders authorization page", () => {
  render(<LandingPage />);
  const authorization = screen.getAllText(/login/i);
  expect(authorization).toBeInTheDocument();
});
