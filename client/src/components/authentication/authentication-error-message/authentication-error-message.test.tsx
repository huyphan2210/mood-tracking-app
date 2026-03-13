import { screen, render } from "@testing-library/react";
import AuthenticationErrorMessage from "./authentication-error-message";

describe("AuthenticationErrorMessage", () => {
  it("renders a paragraph with correct error message", () => {
    const errorText = "Test error message";

    render(<AuthenticationErrorMessage errorMessage={errorText} />);
    const errorMessage = screen.getByRole("alert");

    expect(errorMessage).toHaveTextContent(errorText);
  });
});
