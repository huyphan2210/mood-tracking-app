"use client";

import { FC } from "react";
import styles from "./primary-button.module.scss";

interface IPrimaryButtonBase {
  content: string;
  customClass?: string;
  onClickHandler?: () => void;
  isDisabled?: boolean;
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
  isDisabled = false,
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      className={`${styles["primary-btn"]} ${customClass}`}
      onClick={onClickHandler}
      disabled={isDisabled || isLoading}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
