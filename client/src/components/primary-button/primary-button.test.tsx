import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrimaryButton, {
  IPrimaryButton,
  IPrimaryButtonForForm,
} from "./primary-button";

interface IPrimaryButtonVariantTestData {
  type: "submit" | "button";
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickHandler?: jest.Mock<any, any, any>;
}

describe("PrimaryButton", () => {
  it.each([
    { type: "submit", content: "Submit Form" },
    { type: "button", content: "Click Me", onClickHandler: jest.fn() },
  ] as IPrimaryButtonVariantTestData[])(
    "renders the %s variant",
    ({ type, content, onClickHandler }) => {
      const props = { type, content, onClickHandler };

      render(
        <PrimaryButton
          {...(props as IPrimaryButton | IPrimaryButtonForForm)}
        />,
      );

      const button = screen.getByRole("button", {
        name: new RegExp(content, "i"),
      });

      expect(button).toHaveAttribute("type", type);
    },
  );

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
