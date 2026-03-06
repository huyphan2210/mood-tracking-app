"use client";

import { ChangeEvent, FC, useRef, useState } from "react";
import styles from "./authentication-fields.module.scss";

import { AUTHENTICATION_VALIDATOR_RECORDS } from "@/services/authentication/AuthenticationService";

import invalidIcon from "@/icons/invalid.svg";
import Image from "next/image";

export type AuthenticationVariant = "login" | "signup";

export interface IAuthenticationFields {
  type: AuthenticationVariant;
}
const INPUT_TIMEOUT = 300;
const EMAIL = "email";
const PASSWORD = "password";
const SIGNUP_NOTE =
  "Must have at least 6 characters, 1 non-alphanumeric, 1 digit, 1 uppercase, and 1 lowercase.";

const AuthenticationFields: FC<IAuthenticationFields> = ({ type }) => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const SET_ERROR_MSG_RECORDS: Record<string, (value: string) => void> = {
    ["email"]: (value) => setEmailError(value),
    ["password"]: (value) => setPasswordError(value),
  };

  const debounceValidating = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.currentTarget;
    const value = inputElement.value;

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!AUTHENTICATION_VALIDATOR_RECORDS[inputElement.id](value)) {
        const invalidMessage = `Invalid ${inputElement.id} format.`;
        SET_ERROR_MSG_RECORDS[inputElement.id](invalidMessage);
        inputElement.setCustomValidity(invalidMessage);
        inputElement.classList.add(
          styles["authentication-field-set_field-wrapper_input--invalid"],
        );
        return;
      }

      inputElement.setCustomValidity("");
      SET_ERROR_MSG_RECORDS[inputElement.id]("");
      inputElement.classList.remove(
        styles["authentication-field-set_field-wrapper_input--invalid"],
      );
    }, INPUT_TIMEOUT);
  };

  return (
    <fieldset className={styles["authentication-field-set"]}>
      <div className={styles["authentication-field-set_field-wrapper"]}>
        <label
          htmlFor={EMAIL}
          className={styles["authentication-field-set_field-wrapper_label"]}
        >
          Email address
        </label>
        <input
          required
          placeholder="name@mail.com"
          id={EMAIL}
          name={EMAIL}
          type={EMAIL}
          className={styles["authentication-field-set_field-wrapper_input"]}
          aria-invalid={emailError ? "true" : undefined}
          aria-errormessage={emailError ? `${EMAIL}_error` : undefined}
          onChange={debounceValidating}
        ></input>
        {emailError && (
          <span
            id={`${EMAIL}_error`}
            className={
              styles["authentication-field-set_field-wrapper_error-msg"]
            }
            role="alert"
          >
            <Image src={invalidIcon} alt="Invalid Icon" />
            {emailError}
          </span>
        )}
      </div>
      <div className={styles["authentication-field-set_field-wrapper"]}>
        <label
          htmlFor={PASSWORD}
          className={styles["authentication-field-set_field-wrapper_label"]}
        >
          Password
        </label>
        <input
          required
          minLength={6}
          id={PASSWORD}
          name={PASSWORD}
          type={PASSWORD}
          className={styles["authentication-field-set_field-wrapper_input"]}
          aria-invalid={passwordError ? "true" : undefined}
          aria-errormessage={passwordError ? `${PASSWORD}_error` : undefined}
          onChange={debounceValidating}
        ></input>
        {passwordError && (
          <span
            id={`${PASSWORD}_error`}
            className={
              styles["authentication-field-set_field-wrapper_error-msg"]
            }
            role="alert"
          >
            <Image src={invalidIcon} alt="Invalid Icon" />
            {passwordError}
          </span>
        )}
        {type === "signup" && (
          <span
            className={styles["authentication-field-set_field-wrapper_note"]}
          >
            {SIGNUP_NOTE}
          </span>
        )}
      </div>
    </fieldset>
  );
};

export default AuthenticationFields;
