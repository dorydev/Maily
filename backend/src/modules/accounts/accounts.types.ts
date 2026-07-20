export type MailProvider = "smtp" | "gmail" | "microsoft";
export type AccountStatus = "connected" | "disconnected" | "error";
export type SmtpAuthType = "password" | "app_password" | "oauth2";

export type MailAccount = {
  id: string;
  userId: string;
  provider: MailProvider;
  label: string;
  fromEmail: string;
  fromName?: string;
  status: AccountStatus;
  lastConnectionTestAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};

export type SmtpAccountConfig = {
  accountId: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  authType: SmtpAuthType;
  secretRef: string;
};

export type SmtpAccountDetails = MailAccount & {
  provider: "smtp";
  smtpConfig: SmtpAccountConfig;
};

export type CreateSmtpAccountInput = {
  label: string;
  fromEmail: string;
  fromName?: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  authType: SmtpAuthType;
};
