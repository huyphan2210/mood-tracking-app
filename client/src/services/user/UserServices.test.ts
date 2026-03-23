jest.mock("../ServiceBase", () => {
  const actual = jest.requireActual("../ServiceBase");
  return {
    ...actual,
    PATCHApiWithFormFile: jest.fn(),
  };
});

import { ServiceError, PATCHApiWithFormFile } from "../ServiceBase";
import { updateUser } from "./UserServices";

describe("UserService - updateUser", () => {
  it("throws ServiceError when PATCHApiWithFormFile throws one", async () => {
    (PATCHApiWithFormFile as jest.Mock).mockRejectedValue(new Error());

    const formData = new FormData();
    formData.append("FullName", "Test");

    try {
      await updateUser(formData);
      fail("Expected updateUser to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).message).toBe(
        "User Service is temporarily unavailable",
      );
    }
  });

  it("runs smoothly", async () => {
    (PATCHApiWithFormFile as jest.Mock).mockResolvedValue("");
    const formData = new FormData();
    formData.append("FullName", "Test");

    await updateUser(formData);
  });
});
