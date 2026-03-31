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

export enum SleepHours {
  ZeroToTwo = "ZeroToTwo",
  ThreeToFour = "ThreeToFour",
  FiveToSix = "FiveToSix",
  SevenToEight = "SevenToEight",
  NinePlus = "NinePlus",
}

export enum MoodName {
  VerySad = "VerySad",
  Sad = "Sad",
  Neutral = "Neutral",
  Happy = "Happy",
  VeryHappy = "VeryHappy",
}

export enum IdentityErrorCode {
  PasswordRequiresNonAlphanumeric = "PasswordRequiresNonAlphanumeric",
  PasswordRequiresDigit = "PasswordRequiresDigit",
  PasswordRequiresLower = "PasswordRequiresLower",
  PasswordRequiresUpper = "PasswordRequiresUpper",
  PasswordTooShort = "PasswordTooShort",
  DuplicateUserName = "DuplicateUserName",
  EmailIsInvalid = "EmailIsInvalid",
  UserNotFound = "UserNotFound",
}

export enum Feeling {
  Overwhelmed = "Overwhelmed",
  Stressed = "Stressed",
  Anxious = "Anxious",
  Frustrated = "Frustrated",
  Disappointed = "Disappointed",
  Lonely = "Lonely",
  Irritable = "Irritable",
  Down = "Down",
  Restless = "Restless",
  Tired = "Tired",
  Calm = "Calm",
  Content = "Content",
  Peaceful = "Peaceful",
  Hopeful = "Hopeful",
  Motivated = "Motivated",
  Grateful = "Grateful",
  Optimistic = "Optimistic",
  Confident = "Confident",
  Excited = "Excited",
  Joyful = "Joyful",
}

export interface AnalyzeMoodRequestPOST {
  /** @minItems 1 */
  feelings: Feeling[];
  mood: MoodName;
  sleepHours: SleepHours;
  moodDescription: string;
}

export interface AuthenticationBaseResponsePOST {
  status: UserStatus;
  jwt: string;
}

export interface ErrorResponse {
  errorCode?: null | string;
  message: string;
}

/** @format binary */
export type IFormFile = File;

export interface LoginRequestPOST {
  email: string;
  password: string;
}

export interface SignUpErrorResponse {
  errorCode?: IdentityErrorCode;
  message: string;
}

export interface SignUpRequestPOST {
  email: string;
  password: string;
}

export interface UpdateUserResponse {
  status: UserStatus;
  jwt: string;
}

export interface UserResponse {
  fullName: string;
  email: string;
  avatarURL?: null | string;
}
