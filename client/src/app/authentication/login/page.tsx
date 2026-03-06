"use client";

import { FC } from "react";
import styles from "./page.module.scss";
import AuthenticationForm from "@/components/authentication/authentication-form";
import { login } from "./action";
import AuthenticationFields from "@/components/authentication/authentication-fields/authentication-fields";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";
import Link from "next/link";
import PATH from "@/lib/paths";
import HomeNavigation from "@/components/home-navigation/home-navigation";

const Login: FC = () => {
  const heading = "Welcome back!";
  const description = "Log in to continue tracking your mood and sleep.";

  const submitHandler = async (formData: FormData) => {
    await login(formData);
  };

  return (
    <>
      <HomeNavigation isDisabled />
      <AuthenticationForm
        heading={heading}
        description={description}
        submitHandler={submitHandler}
      >
        <AuthenticationFields type="login" />
        <AuthenticationCta ctaContent="Log In">
          <span className={styles["login_cta-note"]}>
            Haven&apos;t got an account?{" "}
            <Link href={PATH.SIGNUP} className={styles["login_cta-note_url"]}>
              Sign up
            </Link>
          </span>
        </AuthenticationCta>
      </AuthenticationForm>
    </>
  );
};

export default Login;
