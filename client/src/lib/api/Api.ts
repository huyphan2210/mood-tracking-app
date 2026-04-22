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
  MoodResponse,
  MoodTrends,
  SignUpErrorResponse,
  SignUpRequestPOST,
  UpdateUserResponse,
  UserResponse,
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
   * @name MoodList
   * @request GET:/api/mood
   */
  moodList = (
    query?: {
      /** @format date-time */
      startDate?: string;
      /** @format date-time */
      endDate?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MoodResponse, ErrorResponse>({
      path: `/api/mood`,
      method: "GET",
      query: query,
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
    this.request<void, ErrorResponse>({
      path: `/api/mood`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Mood
   * @name MoodTrendsList
   * @request GET:/api/mood/trends
   */
  moodTrendsList = (
    query?: {
      /** @format date-time */
      startDate?: string;
      /** @format date-time */
      endDate?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MoodTrends, ErrorResponse>({
      path: `/api/mood/trends`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserList
   * @request GET:/api/user
   */
  userList = (params: RequestParams = {}) =>
    this.request<UserResponse, ErrorResponse>({
      path: `/api/user`,
      method: "GET",
      format: "json",
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
