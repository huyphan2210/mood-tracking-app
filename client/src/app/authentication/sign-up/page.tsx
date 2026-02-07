import { FC } from "react";
import styles from "./page.module.scss";
import { signUp } from "./action";
import AuthenticationForm from "@/components/authentication/authentication-form";

const SignUp: FC = () => {
  const heading = "Create an account";
  const description = "Join to track your daily mood and sleep with ease.";
  return (
    <AuthenticationForm
      heading={heading}
      description={description}
      submitHandler={signUp}
    >
      <input name="email" type="email" placeholder="name@mail.com"></input>
    </AuthenticationForm>
  );
};

export default SignUp;
