"use client";

import { FC, useState, SubmitEventHandler } from "react";

import AuthenticationErrorMessage from "@/components/authentication/authentication-error-message/authentication-error-message";
import Modal from "@/components/modal/modal";
import PrimaryButton from "@/components/primary-button/primary-button";
import UpdateUserFields from "../update-user-fields/update-user-fields";

import { updateUser } from "@/services/user/UserServices";
import { ServiceError, BadServiceRequest } from "@/services/ServiceBase";

import styles from "./update-profile.modal.module.scss";
import { UserResponse } from "@/lib/api/data-contracts";

interface IUpdateProfileModal {
  userInfo?: UserResponse;
  isOpen?: boolean;
  onClose: (userInfoChanged?: boolean) => void;
}

const UpdateProfileModal: FC<IUpdateProfileModal> = ({
  userInfo,
  onClose,
  isOpen = false,
}) => {
  const heading = "Update your profile";
  const description = "Personalize your account with your name and photo.";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      setIsLoading(true);
      await updateUser(formData);
      onClose(true);
    } catch (error) {
      if (error instanceof ServiceError || error instanceof BadServiceRequest) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={styles.updateProfileModalHeading}>{heading}</h2>
      <p className={styles.updateProfileModalDescription}>{description}</p>
      <form id={styles.updateUserForm} onSubmit={submitHandler}>
        {userInfo && (
          <UpdateUserFields
            name={userInfo.fullName}
            avatarUrl={userInfo.avatarURL}
          />
        )}
        {errorMessage && (
          <AuthenticationErrorMessage
            errorMessage={errorMessage}
            attributes={{ id: `${styles.updateUserForm}_err` }}
          />
        )}
        <PrimaryButton
          content={"Save Changes"}
          isLoading={isLoading}
          type="submit"
        />
      </form>
    </Modal>
  );
};

export default UpdateProfileModal;
