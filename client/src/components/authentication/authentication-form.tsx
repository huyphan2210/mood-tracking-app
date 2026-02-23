"use client";

import { FC, ReactNode, SubmitEventHandler } from "react";
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
  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitHandler(formData);
  };

  return (
    <>
      <HomeNavigation isDisabled />
      <form
        onSubmit={onSubmit}
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
