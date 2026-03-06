import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthenticationForm from "./authentication-form";

describe("AuthenticationForm", () => {
  const headingString = "heading";
  const descriptionString = "description";

  it("renders heading, description, and its children", () => {
    const submitHandler = jest.fn();
    render(
      <AuthenticationForm
        heading={headingString}
        description={descriptionString}
        submitHandler={submitHandler}
      >
        Child
      </AuthenticationForm>,
    );
    const form = screen.getByRole("form", { name: headingString });
    const heading = within(form).getByRole("heading");
    const description = within(form).getByRole("paragraph");
    const child = within(form).getByText("Child");

    expect(heading).toHaveTextContent(headingString);
    expect(heading).toHaveAttribute("id", "auth-heading");
    expect(description).toHaveTextContent(descriptionString);
    expect(child).toBeInTheDocument();
  });

  it("calls submitHandler when the form is being submitting", async () => {
    const submitHandler = jest.fn();
    const user = userEvent.setup();
    render(
      <AuthenticationForm
        heading={headingString}
        description={descriptionString}
        submitHandler={submitHandler}
      >
        <button type="submit">Submit</button>
      </AuthenticationForm>,
    );

    const form = screen.getByRole("form", { name: headingString });
    await user.click(within(form).getByRole("button", { name: /submit/i }));

    expect(submitHandler).toHaveBeenCalledTimes(1);
  });
});
