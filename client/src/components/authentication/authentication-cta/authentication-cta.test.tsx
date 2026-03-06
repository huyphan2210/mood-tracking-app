import { screen, render } from "@testing-library/react";
import AuthenticationCta from "./authentication-cta";

describe("AuthenticationCta", () => {
  it("renders CTA content and its children", () => {
    const ctaContent = "Authenticate";
    const childText = "Already have an account?";

    render(
      <AuthenticationCta ctaContent={ctaContent}>
        <span>{childText}</span>
      </AuthenticationCta>,
    );

    expect(
      screen.getByRole("button", { name: ctaContent }),
    ).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
