import type { SmtpAccountConfig } from "../modules/accounts/accounts.types";

export type MailProviderKind = "smtp" | "gmail" | "microsoft";

export type MailAddress = {
  email: string;
  name?: string;
};

export type MailMessage = {
  from: MailAddress;
  to: MailAddress[];
  cc?: MailAddress[];
  bcc?: MailAddress[];
  subject: string;
  text?: string;
  html?: string;
};

export type SendMailResult = {
  providerMessageId?: string;
  rawResponse?: unknown;
};

export type TestConnectionResult = {
  success: true;
};

export type MailAccountContext = {
  accountId: string;
  provider: MailProviderKind;
  fromEmail: string;
  fromName?: string;
  smtpConfig?: SmtpAccountConfig;
  smtpPassword?: string;
};

export interface MailProvider {
  kind: MailProviderKind;

  testConnection(account: MailAccountContext): Promise<TestConnectionResult>;

  send(
    account: MailAccountContext,
    message: MailMessage
  ): Promise<SendMailResult>;
}
