import type {
  MailAccountContext,
  MailMessage,
  SendMailResult,
  TestConnectionResult
} from "../../providers/mail-provider.interface";
import {MailProviderRegistry} from "../../providers/mail-provider.registry";

import { findSmtpAccountById } from "../../database/repositories/accounts.repository";
import { SmtpProvider } from "../../providers/smtp/smtp.provider";
import { DevSecretStore } from "../auth/dev-secret-store.services";
import type { MailAddress } from "../../providers/mail-provider.interface";

type SendMailInput = {
  accountId: string;
  to: MailAddress[];
  cc?: MailAddress[];
  bcc?: MailAddress[];
  subject: string;
  text?: string;
  html?: string;
};

const smtpProvider = new SmtpProvider();
const secretStore = new DevSecretStore();

export async function sendMailWithAccount(
  userId: string,
  input: SendMailInput
) {
  const account = findSmtpAccountById(userId, input.accountId);

  if (!account) {
    throw new Error("SMTP account not found");
  }

  const smtpPassword = await secretStore.get(account.smtpConfig.secretRef);

  return smtpProvider.send(
    {
      accountId: account.id,
      provider: "smtp",
      fromEmail: account.fromEmail,
      fromName: account.fromName,
      smtpConfig: account.smtpConfig,
      smtpPassword
    },
    {
      from: {
        email: account.fromEmail,
        name: account.fromName
      },
      to: input.to,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      text: input.text,
      html: input.html
    }
  );
}

export class MailService {
  constructor(private readonly providerRegistry: MailProviderRegistry) {}

  async send(
    account: MailAccountContext,
    message: MailMessage
  ): Promise<SendMailResult> {
    const provider = this.providerRegistry.get(account.provider);

    return provider.send(account, message);
  }

  async testConnection(
    account: MailAccountContext
  ): Promise<TestConnectionResult> {
    const provider = this.providerRegistry.get(account.provider);

    return provider.testConnection(account);
  }
}
