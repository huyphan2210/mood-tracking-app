"use client";

import { FC, HTMLAttributes, ReactNode, SubmitEventHandler } from "react";
import styles from "./authentication-form.module.scss";

interface IAuthenticationForm {
  attributes?: HTMLAttributes<HTMLFormElement>;
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
  attributes,
}) => {
  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitHandler(formData);
  };

  return (
    <form
      aria-labelledby="auth-heading"
      onSubmit={onSubmit}
      className={styles["authentication-container_form"]}
      {...attributes}
    >
      <div className={styles["authentication-container_form_text"]}>
        <h1
          id="auth-heading"
          className={styles["authentication-container_form_text_heading"]}
        >
          {heading}
        </h1>
        <p className={styles["authentication-container_form_text_description"]}>
          {description}
        </p>
      </div>
      {children}
    </form>
  );
};

export default AuthenticationForm;
