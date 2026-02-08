import { FC } from "react";
import styles from "./primary-button.module.scss";

interface IPrimaryButtonBase {
  content: string;
  customClass?: string;
  onClickHandler?: () => void;
}

interface IPrimaryButtonForForm extends IPrimaryButtonBase {
  type: "submit";
}

interface IPrimaryButton extends IPrimaryButtonBase {
  type: "button";
  onClickHandler: () => void;
}

const PrimaryButton: FC<IPrimaryButtonForForm | IPrimaryButton> = ({
  content,
  customClass,
  type,
  onClickHandler,
}) => {
  return (
    <button
      type={type}
      className={`${styles["primary-btn"]} ${customClass}`}
      onClick={onClickHandler}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
