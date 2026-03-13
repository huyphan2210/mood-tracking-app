import { screen, render } from "@testing-library/react";
import HomeNavigation from "./home-navigation";
import PATH from "@/lib/paths";

describe("HomeNavigation", () => {
  it("renders an anchor tag at its default state", async () => {
    render(<HomeNavigation />);

    const anchorTag = screen.getByRole("link", { name: /mood tracker/i });
    expect(anchorTag).toHaveAttribute("href", PATH.HOME);
  });

  it("renders an div tag when isDisabled is passed as a prop", async () => {
    render(<HomeNavigation isDisabled />);

    const anchorTag = screen.queryByRole("link");
    const logo = screen.queryByText(/mood tracker/i);

    expect(anchorTag).not.toBeInTheDocument();
    expect(logo).toBeInTheDocument();
  });
});
