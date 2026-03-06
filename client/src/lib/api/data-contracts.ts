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

export enum UserStatus {
  Inactive = "Inactive",
  NoFullName = "NoFullName",
  Active = "Active",
}

export enum IdentityErrorCode {
  PasswordRequiresNonAlphanumeric = "PasswordRequiresNonAlphanumeric",
  PasswordRequiresDigit = "PasswordRequiresDigit",
  PasswordRequiresLower = "PasswordRequiresLower",
  PasswordRequiresUpper = "PasswordRequiresUpper",
  PasswordTooShort = "PasswordTooShort",
  DuplicateUserName = "DuplicateUserName",
  EmailIsInvalid = "EmailIsInvalid",
}

export interface AuthenticationBaseResponsePOST {
  status: UserStatus;
  jwt: string;
}

export interface AuthenticationLoginRequestPOST {
  email: string;
  password: string;
}

export interface AuthenticationSignUpRequestPOST {
  email: string;
  password: string;
}

export interface ErrorResponse {
  errorCode?: null | string;
  message: string;
}

export interface SignUpErrorResponse {
  errorCode?: IdentityErrorCode;
  message: string;
}
