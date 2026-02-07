import { FC, ReactNode } from "react";
import styles from "./authentication-form.module.scss";
import HomeLogo from "../home-logo/home-logo";

interface IAuthenticationForm {
  heading: string;
  description: string;
  submitHandler: (formData: FormData) => Promise<void>;
  children: ReactNode;
}

const AuthenticationForm: FC<IAuthenticationForm> = ({
  heading,
  description,
  submitHandler,
  children,
}) => {
  return (
    <>
      <HomeLogo />
      <form
        action={submitHandler}
        className={styles["authentication-container_form"]}
      >
        <h1 className={styles["authentication-container_form_heading"]}>
          {heading}
        </h1>
        <p className={styles["authentication-container_form_description"]}>
          {description}
        </p>
        {children}
      </form>
    </>
  );
};

export default AuthenticationForm;
