/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AnalyzeMoodRequestPOST,
  AuthenticationBaseResponsePOST,
  ErrorResponse,
  IFormFile,
  LoginRequestPOST,
  SignUpErrorResponse,
  SignUpRequestPOST,
  UpdateUserResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Authentication
   * @name AuthSignUpCreate
   * @request POST:/api/auth/sign-up
   */
  authSignUpCreate = (data: SignUpRequestPOST, params: RequestParams = {}) =>
    this.request<
      AuthenticationBaseResponsePOST,
      SignUpErrorResponse | ErrorResponse
    >({
      path: `/api/auth/sign-up`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Authentication
   * @name AuthLoginCreate
   * @request POST:/api/auth/login
   */
  authLoginCreate = (data: LoginRequestPOST, params: RequestParams = {}) =>
    this.request<AuthenticationBaseResponsePOST, ErrorResponse>({
      path: `/api/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Mood
   * @name MoodCreate
   * @request POST:/api/mood
   */
  moodCreate = (data: AnalyzeMoodRequestPOST, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/mood`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserUpdatePartialUpdate
   * @request PATCH:/api/user/update
   */
  userUpdatePartialUpdate = (
    data: {
      FullName?: string;
      AvatarImage?: IFormFile;
    },
    params: RequestParams = {},
  ) =>
    this.request<UpdateUserResponse, ErrorResponse>({
      path: `/api/user/update`,
      method: "PATCH",
      body: data,
      type: ContentType.UrlEncoded,
      format: "json",
      ...params,
    });
}
