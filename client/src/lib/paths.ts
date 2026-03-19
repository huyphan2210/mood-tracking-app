enum PATH {
  HOME = "/",
  LOGIN = "/auth/login",
  SIGNUP = "/auth/sign-up",
  ONBOARDING = "/user/onboarding",
}

export const AUTH_ONBOARDING_PATHS: string[] = [
  PATH.ONBOARDING,
  PATH.LOGIN,
  PATH.SIGNUP,
];

export default PATH;
