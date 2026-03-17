"use client";

import { FC, useState } from "react";
import styles from "./page.module.scss";
import AuthenticationForm from "@/components/authentication/authentication-form";
import AuthenticationFields from "@/components/authentication/authentication-fields/authentication-fields";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";
import Link from "next/link";
import PATH from "@/lib/paths";
import HomeNavigation from "@/components/home-navigation/home-navigation";
import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";
import { useRouter } from "next/navigation";
import { BadServiceRequest, ServiceError } from "@/services/ServiceBase";
import { login } from "@/services/authentication/AuthenticationService";
import { UserStatus } from "@/lib/api/data-contracts";

const Login: FC = () => {
  const heading = "Welcome back!";
  const description = "Log in to continue tracking your mood and sleep.";

  const loginFormId = "login-form";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const submitHandler = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const result = await login(formData);
      if (result.status === UserStatus.NoFullName) {
        router.push(PATH.ONBOARDING);
      } else {
        router.push(PATH.HOME);
      }
    } catch (error) {
      if (error instanceof ServiceError || error instanceof BadServiceRequest) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HomeNavigation isDisabled />
      <AuthenticationForm
        heading={heading}
        description={description}
        submitHandler={submitHandler}
        attributes={{
          id: loginFormId,
          "aria-errormessage": `${errorMessage ? loginFormId + "_err" : undefined}`,
        }}
      >
        <AuthenticationFields type="login" />
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${loginFormId}_err` }}
          />
        )}
        <AuthenticationCta isLoading={isLoading} ctaContent="Log In">
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
