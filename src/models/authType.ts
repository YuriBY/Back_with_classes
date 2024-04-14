export type AuthBodyType = {
  loginOrEmail: string;
  password: string;
};

export type AuthUserType = {
  login: string;
  email: string;
  userId: string;
};

export type AuthRegistrationbBodyType = {
  login: string;
  email: string;
  password: string;
};

export type CodeConfirmationOfRegistration = {
  code: string;
};

export type EmailConfirmationResendingType = {
  email: string;
};

export type EmailRecoveryInputType = {
  newPassword: string;
  recoveryCode: string;
};
