import { FC } from "react";
import styles from "./authentication-fields.module.scss";

interface IAuthenticationFields {
  type: "signup" | "login";
}

const AuthenticationFields: FC<IAuthenticationFields> = ({ type }) => {
  const email = "email";
  const password = "password";

  return (
    <fieldset className={styles["authentication-field-set"]}>
      <div className={styles["authentication-field-set_field-wrapper"]}>
        <label
          htmlFor={email}
          className={styles["authentication-field-set_field-wrapper_label"]}
        >
          Email address
        </label>
        <input
          id={email}
          name={email}
          className={styles["authentication-field-set_field-wrapper_input"]}
          type={email}
          placeholder="name@mail.com"
        ></input>
      </div>
      <div className={styles["authentication-field-set_field-wrapper"]}>
        <label
          htmlFor={password}
          className={styles["authentication-field-set_field-wrapper_label"]}
        >
          Password
        </label>
        <input
          id={password}
          name={password}
          className={styles["authentication-field-set_field-wrapper_input"]}
          minLength={6}
          type={password}
        ></input>
        {type === "signup" && (
          <span
            className={styles["authentication-field-set_field-wrapper_note"]}
          >
            Must have at least 6 characters, 1 non-alphanumeric, 1 digit, 1
            uppercase, and 1 lowercase.
          </span>
        )}
      </div>
    </fieldset>
  );
};

export default AuthenticationFields;
