import { FC } from "react";
import styles from "./authentication-fields.module.scss";

const AuthenticationFields: FC = () => {
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
          type={password}
        ></input>
      </div>
    </fieldset>
  );
};

export default AuthenticationFields;
