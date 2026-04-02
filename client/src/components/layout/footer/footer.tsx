"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";

import styles from "./footer.module.scss";

import { AUTH_ONBOARDING_PATHS } from "@/lib/paths";

export interface ILayoutFooter {}

const LayoutFooter: FC<ILayoutFooter> = ({}) => {
  const pathname = usePathname();
  return (
    !AUTH_ONBOARDING_PATHS.includes(pathname) && (
      <footer className={styles.footer}></footer>
    )
  );
};

export default LayoutFooter;
