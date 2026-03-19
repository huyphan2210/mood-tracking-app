/**
 * @jest-environment node
 */

import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";
import { POST } from "./route";

jest.mock("../../../../lib/api/Api", () => {
  class ApiMock {
    public authLoginCreate = jest.fn();

    constructor() {
      (this.authLoginCreate as jest.Mock).mockResolvedValue({
        json: async () => ({
          jwt: "test-jwt",
        }),
      });
    }
  }

  return {
    Api: ApiMock,
  };
});

describe("POST /api/authentication/login", () => {
  it("sends data an return jwt successfully with status 200", async () => {
    const response = await POST({
      json: async () => ({
        email: "test@yopmail.com",
        password: "Test@1234",
      }),
    } as unknown as NextRequest);

    expect(response.status).toEqual(200);
    expect(response.cookies.get("jwt")?.value).toEqual("test-jwt");
  });

  it("returns 400 when email is invalid", async () => {
    const response = await POST({
      json: async () => ({
        email: "",
        password: "Test@1234",
      }),
    } as unknown as NextRequest);

    expect(response.status).toEqual(400);

    const apiError: ApiError = await response.json();
    expect(apiError.message).toEqual("Invalid email format");
  });

  it("returns 400 when password is invalid", async () => {
    const response = await POST({
      json: async () => ({
        email: "test@yopmail.com",
        password: "",
      }),
    } as unknown as NextRequest);

    expect(response.status).toEqual(400);

    const apiError: ApiError = await response.json();
    expect(apiError.message).toEqual("Invalid password format");
  });

  it("returns 500 when there's an unknown error", async () => {
    const response = await POST({
      json: jest.fn().mockRejectedValue(new Error()),
    } as unknown as NextRequest);

    expect(response.status).toEqual(500);

    const apiError: ApiError = await response.json();
    expect(apiError.message).toEqual("Authentication Service is unavailable");
  });
});
