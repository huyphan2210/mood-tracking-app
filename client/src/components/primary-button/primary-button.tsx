"use client";

import { FC } from "react";
import styles from "./primary-button.module.scss";

interface IPrimaryButtonBase {
  content: string;
  customClass?: string;
  onClickHandler?: () => void;
  isLoading?: boolean;
}

export interface IPrimaryButtonForForm extends IPrimaryButtonBase {
  type: "submit";
}

export interface IPrimaryButton extends IPrimaryButtonBase {
  type: "button";
  onClickHandler: () => void;
}

const PrimaryButton: FC<IPrimaryButtonForForm | IPrimaryButton> = ({
  content,
  customClass,
  type,
  onClickHandler,
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      className={`${styles["primary-btn"]} ${customClass}`}
      onClick={onClickHandler}
      disabled={isLoading}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
