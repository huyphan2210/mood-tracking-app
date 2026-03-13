jest.mock("../../../services/authentication/AuthenticationService", () => {
  const actual = jest.requireActual(
    "../../../services/authentication/AuthenticationService",
  );

  return {
    ...actual,
    signUp: jest.fn(),
  };
});

import { screen, render, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signUp } from "@/services/authentication/AuthenticationService";
import SignUp from "./page";
import { ServiceError } from "@/services/ServiceBase";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signUp Service once the user fills in valid information and no error is shown", async () => {
    const user = userEvent.setup();

    render(<SignUp />);

    const form = screen.getByRole("form");
    const emailInput = within(form).getByLabelText(/email address/i);
    const passwordInput = within(form).getByLabelText(/password/i);
    const submitButton = within(form).getByRole("button", { name: /sign up/i });
    const loginNavigator = within(form).getByRole("link", { name: /log in/i });
    const alert = within(form).queryByRole("alert");

    await act(async () => {
      await user.type(emailInput, "test@yopmail.com");
      await user.type(passwordInput, "Test@123");
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledTimes(1);
      expect(alert).not.toBeInTheDocument();
    });
  });

  it("shows ServiceError when signUp throws one", async () => {
    (signUp as jest.Mock).mockRejectedValue(new ServiceError("ServiceError"));

    const user = userEvent.setup();

    render(<SignUp />);

    const form = screen.getByRole("form");
    const emailInput = within(form).getByLabelText(/email address/i);
    const passwordInput = within(form).getByLabelText(/password/i);
    const submitButton = within(form).getByRole("button", { name: /sign up/i });
    const noDisplayAlert = within(form).queryByRole("alert");

    expect(noDisplayAlert).not.toBeInTheDocument();
    await act(async () => {
      await user.type(emailInput, "test@yopmail.com");
      await user.type(passwordInput, "Test@123");
      await user.click(submitButton);
    });
    
    expect(signUp).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      const alert = within(form).getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });
});
