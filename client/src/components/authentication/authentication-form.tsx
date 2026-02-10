import { FC, ReactNode } from "react";
import styles from "./authentication-form.module.scss";
import HomeNavigation from "../home-navigation/home-navigation";

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
      <HomeNavigation
        customClass={styles["authentication-container_home-nav"]}
        isDisabled
      />
      <form
        action={submitHandler}
        className={styles["authentication-container_form"]}
      >
        <div className={styles["authentication-container_form_text"]}>
          <h1 className={styles["authentication-container_form_text_heading"]}>
            {heading}
          </h1>
          <p
            className={styles["authentication-container_form_text_description"]}
          >
            {description}
          </p>
        </div>
        {children}
      </form>
    </>
  );
};

export default AuthenticationForm;
