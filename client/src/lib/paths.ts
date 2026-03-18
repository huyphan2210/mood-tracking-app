enum PATH {
  HOME = "/",
  LOGIN = "/auth/login",
  SIGNUP = "/auth/sign-up",
  ONBOARDING = "/user/onboarding",
}

export const AUTHENTICATION_PATHS: string[] = [
  PATH.HOME,
  PATH.LOGIN,
  PATH.SIGNUP,
];

export default PATH;
