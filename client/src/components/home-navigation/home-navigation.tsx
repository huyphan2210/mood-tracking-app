import { FC } from "react";
import Link from "next/link";

import styles from "./home-navigation.module.scss";
import logoIcon from "../../icons/logo.svg";

import PATH from "@/lib/paths";
import Image from "next/image";

interface IHomeNavigation {
  customClass?: string;
  isDisabled?: boolean;
}

const HomeNavigation: FC<IHomeNavigation> = ({
  customClass,
  isDisabled = false,
}) => {
  const APP_NAME = "Mood tracker";
  const logoAlt = "Home Icon";

  return (
    <>
      {!isDisabled && (
        <Link
          href={PATH.HOME}
          className={`${styles["home-navigation"]} ${customClass}`}
        >
          <Image src={logoIcon} alt={logoAlt} />
          {APP_NAME}
        </Link>
      )}
      {isDisabled && (
        <div className={`${styles["home-navigation"]} ${customClass}`}>
          <Image src={logoIcon} alt={logoAlt} />
          {APP_NAME}
        </div>
      )}
    </>
  );
};

export default HomeNavigation;
