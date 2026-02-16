import { FC, ReactNode } from "react";
import styles from "./authentication-cta.module.scss";
import PrimaryButton from "@/components/primary-button/primary-button";

interface IAuthenticationCta {
  ctaContent: string;
  children?: ReactNode;
}

const AuthenticationCta: FC<IAuthenticationCta> = ({
  ctaContent,
  children,
}) => {
  return (
    <div className={styles["authentication-cta"]}>
      <PrimaryButton
        content={ctaContent}
        customClass={styles["authentication-cta_btn"]}
        type="submit"
      />
      {children}
    </div>
  );
};

export default AuthenticationCta;
