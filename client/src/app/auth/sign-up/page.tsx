"use client";

import { FC, useState } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import PATH from "@/lib/paths";

import AuthenticationForm from "@/components/authentication/authentication-form";
import AuthenticationFields from "@/components/authentication/authentication-fields/authentication-fields";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";

import HomeNavigation from "@/components/home-navigation/home-navigation";

import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";
import { signUp } from "@/services/authentication/AuthenticationService";
import { BadServiceRequest, ServiceError } from "@/services/ServiceBase";
import { useRouter } from "next/navigation";

const SignUp: FC = () => {
  const signUpFormId = "sign-up-form";
  const heading = "Create an account";
  const description = "Join to track your daily mood and sleep with ease.";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const submitHandler = async (formData: FormData) => {
    try {
      setIsLoading(true);
      await signUp(formData);

      router.push(PATH.ONBOARDING);
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
          id: signUpFormId,
          "aria-errormessage": `${errorMessage ? signUpFormId + "_err" : undefined}`,
        }}
      >
        <AuthenticationFields type="signup" />
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${signUpFormId}_err` }}
          />
        )}
        <AuthenticationCta isLoading={isLoading} ctaContent="Sign Up">
          <span className={styles["sign-up_cta-note"]}>
            Already got an account?{" "}
            <Link href={PATH.LOGIN} className={styles["sign-up_cta-note_url"]}>
              Log In
            </Link>
          </span>
        </AuthenticationCta>
      </AuthenticationForm>
    </>
  );
};

export default SignUp;
