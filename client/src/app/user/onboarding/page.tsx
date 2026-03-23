"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import AuthenticationForm from "@/components/authentication/authentication-form";
import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";
import HomeNavigation from "@/components/home-navigation/home-navigation";

import PATH from "@/lib/paths";
import { ServiceError, BadServiceRequest } from "@/services/ServiceBase";
import { updateUser } from "@/services/user/UserServices";
import styles from "./page.module.scss";
import PrimaryButton from "@/components/primary-button/primary-button";
import UpdateUserFields from "@/components/user/update-user-fields/update-user-fields";

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
      await updateUser(formData);
      router.push(PATH.HOME);
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
        <UpdateUserFields type="onboarding" />
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${updateUserFormId}_err` }}
          />
        )}
        <PrimaryButton
          content={"Start Tracking"}
          isLoading={isLoading}
          type="submit"
        />
      </AuthenticationForm>
    </>
  );
};

export default OnBoarding;
