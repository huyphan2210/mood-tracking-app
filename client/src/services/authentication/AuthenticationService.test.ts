jest.mock("../ServiceBase", () => {
  const actual = jest.requireActual("../ServiceBase");
  return {
    ...actual,
    POSTApi: jest.fn(),
  };
});

import { describe } from "node:test";
import { BadServiceRequest, ServiceError, POSTApi } from "../ServiceBase";
import { login, signUp } from "./AuthenticationService";

describe("AuthenticationService - signUp", () => {
  it("throws BadServiceRequest when email doesn't have the right format", async () => {
    const formData = new FormData();
    formData.append("email", "asd");
    try {
      await signUp(formData);
      fail("Expected signUp to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(BadServiceRequest);
      expect((error as BadServiceRequest).message).toBe(
        "Invalid email format.",
      );
    }
  });

  it("throws BadServiceRequest when password is invalid", async () => {
    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "asd");
    try {
      await signUp(formData);
      fail("Expected signUp to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(BadServiceRequest);
      expect((error as BadServiceRequest).message).toBe(
        "Invalid password format.",
      );
    }
  });

  it("throws ServiceError when POSTApi throws one", async () => {
    (POSTApi as jest.Mock).mockRejectedValue(new Error());

    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "20032231@Home");

    try {
      await signUp(formData);
      fail("Expected signUp to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).message).toBe(
        "SignUp Service is temporarily unavailable",
      );
    }
  });

  it("runs smoothly", async () => {
    (POSTApi as jest.Mock).mockResolvedValue("");
    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "20032231@Home");

    await signUp(formData);
  });
});

describe("AuthenticationService - login", () => {
  it("throws BadServiceRequest when email doesn't have the right format", async () => {
    const formData = new FormData();
    formData.append("email", "asd");
    try {
      await login(formData);
      fail("Expected login to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(BadServiceRequest);
      expect((error as BadServiceRequest).message).toBe(
        "Invalid email format.",
      );
    }
  });

  it("throws BadServiceRequest when password is invalid", async () => {
    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "asd");
    try {
      await login(formData);
      fail("Expected login to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(BadServiceRequest);
      expect((error as BadServiceRequest).message).toBe(
        "Invalid password format.",
      );
    }
  });

  it("throws ServiceError when POSTApi throws one", async () => {
    (POSTApi as jest.Mock).mockRejectedValue(new Error());

    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "20032231@Home");

    try {
      await login(formData);
      fail("Expected login to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError);
      expect((error as ServiceError).message).toBe(
        "Login Service is temporarily unavailable",
      );
    }
  });

  it("runs smoothly", async () => {
    (POSTApi as jest.Mock).mockResolvedValue("");
    const formData = new FormData();
    formData.append("email", "test@yopmail.com");
    formData.append("password", "20032231@Home");

    await login(formData);
  });
});
