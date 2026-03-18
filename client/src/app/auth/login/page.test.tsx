jest.mock("../../../services/authentication/AuthenticationService", () => {
  const actual = jest.requireActual(
    "../../../services/authentication/AuthenticationService",
  );

  return {
    ...actual,
    login: jest.fn(),
  };
});

import { screen, render, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { login } from "@/services/authentication/AuthenticationService";
import Login from "./page";
import { ServiceError } from "@/services/ServiceBase";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls login Service once the user fills in valid information and no error is shown", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const form = screen.getByRole("form");
    const emailInput = within(form).getByLabelText(/email address/i);
    const passwordInput = within(form).getByLabelText(/password/i);
    const submitButton = within(form).getByRole("button", { name: /log in/i });
    const signUpNavigator = within(form).getByRole("link", { name: /sign up/i });
    const alert = within(form).queryByRole("alert");

    await act(async () => {
      await user.type(emailInput, "test@yopmail.com");
      await user.type(passwordInput, "Test@123");
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
      expect(alert).not.toBeInTheDocument();
    });
  });

  it("shows ServiceError when login throws one", async () => {
    (login as jest.Mock).mockRejectedValue(new ServiceError("ServiceError"));

    const user = userEvent.setup();

    render(<Login />);

    const form = screen.getByRole("form");
    const emailInput = within(form).getByLabelText(/email address/i);
    const passwordInput = within(form).getByLabelText(/password/i);
    const submitButton = within(form).getByRole("button", { name: /log in/i });
    const noDisplayAlert = within(form).queryByRole("alert");

    expect(noDisplayAlert).not.toBeInTheDocument();
    await act(async () => {
      await user.type(emailInput, "test@yopmail.com");
      await user.type(passwordInput, "Test@123");
      await user.click(submitButton);
    });
    
    expect(login).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      const alert = within(form).getByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });
});
