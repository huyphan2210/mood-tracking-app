import { FC } from "react";
import Link from "next/link";
import styles from "./page.module.scss";
import PATH from "@/utilities/paths";

import AuthenticationForm from "@/components/authentication/authentication-form";
import AuthenticationFields from "@/components/authentication/authentication-fields/authentication-fields";
import AuthenticationCta from "@/components/authentication/authentication-cta/authentication-cta";

import { signUp } from "./action";

const SignUp: FC = () => {
  const heading = "Create an account";
  const description = "Join to track your daily mood and sleep with ease.";
  return (
    <AuthenticationForm
      heading={heading}
      description={description}
      submitHandler={signUp}
    >
      <AuthenticationFields />
      <AuthenticationCta ctaContent="Sign Up">
        <span className={styles["sign-up_cta-note"]}>
          Already got an account?{" "}
          <Link href={PATH.LOGIN} className={styles["sign-up_cta-note_url"]}>
            Log In
          </Link>
        </span>
      </AuthenticationCta>
    </AuthenticationForm>
  );
};

export default SignUp;
