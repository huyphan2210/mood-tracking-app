import { FC, HTMLAttributes } from "react";

import styles from "./authentication-error-message.module.scss";

import invalidIcon from "@/icons/invalid.svg";
import Image from "next/image";

interface IAuthenticationErrorMessage {
  errorMessage: string;
  attributes?: HTMLAttributes<HTMLParagraphElement>;
}

const AuthenticationErrorMessage: FC<IAuthenticationErrorMessage> = ({
  errorMessage,
  attributes,
}) => {
  return (
    <p
      role="alert"
      className={styles["authentication-error-message"]}
      {...attributes}
    >
      <Image src={invalidIcon} alt="Invalid Icon" width={18} height={18} />
      {errorMessage}
    </p>
  );
};

export default AuthenticationErrorMessage;
