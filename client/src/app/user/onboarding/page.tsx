"use client";

import { FC, useState } from "react";
import AuthenticationForm from "@/components/authentication/authentication-form";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";
import HomeNavigation from "@/components/home-navigation/home-navigation";
import { useRouter } from "next/navigation";
import PATH from "@/lib/paths";
import { UserStatus } from "@/lib/api/data-contracts";
import { login } from "@/services/authentication/AuthenticationService";
import { ServiceError, BadServiceRequest } from "@/services/ServiceBase";
import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";

const OnBoarding: FC = () => {
  const updateUserFormId = "update-user-form";
  const heading = "Personalize your experience";
  const description = "Add your name and a profile picture to make Mood yours.";

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
          id: updateUserFormId,
          "aria-errormessage": `${errorMessage ? updateUserFormId + "_err" : undefined}`,
        }}
      >
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${updateUserFormId}_err` }}
          />
        )}
        <AuthenticationCta
          isLoading={isLoading}
          ctaContent="Start Tracking"
        ></AuthenticationCta>
      </AuthenticationForm>
    </>
  );
};

export default OnBoarding;
