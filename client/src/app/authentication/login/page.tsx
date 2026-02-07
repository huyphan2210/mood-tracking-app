import { FC } from "react";
import styles from "./page.module.scss";
import AuthenticationForm from "@/components/authentication/authentication-form";
import { login } from "./action";

const Login: FC = () => {
  const heading = "Welcome back!";
  const description = "Log in to continue tracking your mood and sleep.";
  return (
    <AuthenticationForm
      heading={heading}
      description={description}
      submitHandler={login}
    >
      <input name="email" type="email" placeholder="name@mail.com"></input>
    </AuthenticationForm>
  );
};

export default Login;
