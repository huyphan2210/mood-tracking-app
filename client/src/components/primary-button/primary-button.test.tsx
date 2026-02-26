import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrimaryButton, {
  IPrimaryButton,
  IPrimaryButtonForForm,
} from "./primary-button";

describe("PrimaryButton", () => {
  it.each([
    ["submit", "Submit Form"],
    ["button", "Click Me"],
  ])("renders the %s variant", (type, content) => {
    const props =
      type === "submit"
        ? { type, content }
        : { type, content, onClickHandler: jest.fn() };

    render(
      <PrimaryButton {...(props as IPrimaryButton | IPrimaryButtonForForm)} />,
    );

    const button = screen.getByRole("button", {
      name: new RegExp(content, "i"),
    });

    expect(button).toHaveAttribute("type", type);
  });

  it("calls onClickHandler when clicked", async () => {
    const user = userEvent.setup();
    const clickHandler = jest.fn();

    render(
      <PrimaryButton
        type="button"
        content="Click Me"
        onClickHandler={clickHandler}
      />,
    );

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it("is disabled if isLoading is true", async () => {
    const user = userEvent.setup();
    const clickHandler = jest.fn();

    render(
      <PrimaryButton
        type="button"
        content="Click Me"
        onClickHandler={clickHandler}
        isLoading={true}
      />,
    );

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
    
    await user.click(button);
    expect(clickHandler).not.toHaveBeenCalled();
  });
});
