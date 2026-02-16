"use client";

import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./main.module.scss";
import { AUTHENTICATION_PATHS } from "@/utilities/paths";

interface ILayoutMain {
  children: ReactNode;
}

const LayoutMain: FC<ILayoutMain> = ({ children }) => {
  const pathname = usePathname();

  return (
    <main
      className={`
        ${styles.main} 
        ${AUTHENTICATION_PATHS.includes(pathname) ? styles["main--authentication"] : ""}
      `}
    >
      {children}
    </main>
  );
};

export default LayoutMain;
