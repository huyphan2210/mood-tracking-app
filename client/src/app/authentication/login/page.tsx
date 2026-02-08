import { FC } from "react";
import styles from "./page.module.scss";
import AuthenticationForm from "@/components/authentication/authentication-form";
import { login } from "./action";
import AuthenticationFields from "@/components/authentication/authentication-fields/authentication-fields";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";
import Link from "next/link";
import PATH from "@/utilities/paths";

const Login: FC = () => {
  const heading = "Welcome back!";
  const description = "Log in to continue tracking your mood and sleep.";

  return (
    <AuthenticationForm
      heading={heading}
      description={description}
      submitHandler={login}
    >
      <AuthenticationFields />
      <AuthenticationCta ctaContent="Log In">
        <span className={styles["login_cta-note"]}>
          Haven&apos;t got an account?{" "}
          <Link href={PATH.SIGNUP} className={styles["login_cta-note_url"]}>
            Sign up
          </Link>
        </span>
      </AuthenticationCta>
    </AuthenticationForm>
  );
};

export default Login;
