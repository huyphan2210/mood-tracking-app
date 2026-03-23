/**
 * @jest-environment node
 */

jest.mock("../../../../lib/api/Api", () => {
  class ApiMock {
    public userUpdatePartialUpdate = jest.fn();
    public setSecurityData = jest.fn();

    constructor() {
      (this.userUpdatePartialUpdate as jest.Mock).mockResolvedValue({
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

jest.mock("../../api.base", () => {
  const actual = jest.requireActual("../../api.base");
  return {
    ...actual,
    getJwt: jest.fn(),
  };
});

import { NextRequest } from "next/server";
import { PATCH } from "./route";
import { getJwt } from "../../api.base";

describe("PATCH /api/user/update", () => {
  it("responds with status 401 when getJwt returns undefined", async () => {
    (getJwt as jest.Mock).mockResolvedValue(undefined);

    const response = await PATCH({} as unknown as NextRequest);
    expect(response.status).toEqual(401);
  });

  it("responds with status 400 when there's no Name nor AvatarImage", async () => {
    (getJwt as jest.Mock).mockResolvedValue(true);

    const response = await PATCH({
      formData: async () => new FormData(),
    } as unknown as NextRequest);

    expect(response.status).toEqual(400);
  });

  it("responds with status 200", async () => {
    (getJwt as jest.Mock).mockResolvedValue(true);
    const formData = new FormData();
    formData.append("FullName", "Test");
    formData.append("AvatarImage", new File([], "TestFile"));

    const response = await PATCH({
      formData: async () => formData,
    } as unknown as NextRequest);

    expect(response.status).toEqual(200);
  });
});
