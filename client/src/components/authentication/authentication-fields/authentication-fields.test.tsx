import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthenticationFields, {
  AuthenticationVariant,
} from "./authentication-fields";

interface IAuthenticationFieldsVariantTestData {
  type: AuthenticationVariant;
  shouldShowNote: boolean;
}

describe("AuthenticationFields", () => {
  it.each([
    { type: "login", shouldShowNote: false },
    { type: "signup", shouldShowNote: true },
  ] as IAuthenticationFieldsVariantTestData[])(
    "renders the %s variant",
    ({ type, shouldShowNote }) => {
      const emailString = "email";
      const passwordString = "password";
      const signUpNote =
        "Must have at least 6 characters, 1 non-alphanumeric, 1 digit, 1 uppercase, and 1 lowercase.";

      render(<AuthenticationFields type={type} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("id", emailString);
      expect(emailInput).toHaveAttribute("name", emailString);
      expect(emailInput).toHaveAttribute("type", emailString);
      expect(emailInput).toHaveAttribute("placeholder", "name@mail.com");

      expect(passwordInput).toHaveAttribute("id", passwordString);
      expect(passwordInput).toHaveAttribute("name", passwordString);
      expect(passwordInput).toHaveAttribute("type", passwordString);
      expect(passwordInput).toHaveAttribute("minlength", "6");

      const note = screen.queryByText(signUpNote);

      if (shouldShowNote) {
        expect(note).toBeInTheDocument();
      } else {
        expect(note).not.toBeInTheDocument();
      }
    },
  );

  it("allows user to type into email input", async () => {
    const user = userEvent.setup();
    const userEmail = "user@mail.com";

    render(<AuthenticationFields type="login" />);

    const emailInput = screen.getByLabelText(/email address/i);

    await user.type(emailInput, userEmail);
    expect(emailInput).toHaveValue(userEmail);
  });
  
  it("allows user to type into password input", async () => {
    const user = userEvent.setup();
    const userPassword = "validpassword";

    render(<AuthenticationFields type="login" />);

    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(passwordInput, userPassword);
    expect(passwordInput).toHaveValue(userPassword);
  });
});
