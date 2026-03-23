import { Api } from "@/lib/api/Api";
import { UpdateUserResponse } from "@/lib/api/data-contracts";
import { NextRequest, NextResponse } from "next/server";
import { badRequest, internalError, api, getJwt } from "../../api.base";
import { IUpdateUserRequestPATCH } from "@/lib/user/intefaces";
import { ContentType } from "@/lib/api/http-client";

export const updateUser = ({ userUpdatePartialUpdate }: Api) =>
  async function PATCH(req: NextRequest) {
    try {
      if (!(await getJwt())) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const formData: FormData = await req.formData();
      const payload = getPayloadFromFormData(formData);
      if (!payload.FullName && !payload.AvatarImage) {
        return badRequest("No Name nor Avatar provided");
      }

      const response = await userUpdatePartialUpdate(payload, {
        type: ContentType.FormData,
        secure: true,
      });

      const updatedUserInfo: UpdateUserResponse = await response.json();
      const returnedResponse = NextResponse.json(updatedUserInfo, {
        status: 200,
      });

      api.setSecurityData(updatedUserInfo.jwt);

      returnedResponse.cookies.set("jwt", updatedUserInfo.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return returnedResponse;
    } catch (error) {
      console.error(error);
      return internalError();
    }
  };

export const PATCH = updateUser(api);

const getPayloadFromFormData = (formData: FormData) => {
  const payload: IUpdateUserRequestPATCH = {
    FullName: (formData.get("FullName") as string) || "",
    AvatarImage: (formData.get("AvatarImage") as File) || undefined,
  };

  return payload;
};
