import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type {
  MailAccountContext,
  MailAddress,
  MailMessage,
  MailProvider,
  SendMailResult,
  TestConnectionResult
} from "../mail-provider.interface";

function formatAddress(address: MailAddress): string {
  if (!address.name) {
    return address.email;
  }

  return `"${address.name}" <${address.email}>`;
}

export class SmtpProvider implements MailProvider {
  readonly kind = "smtp" as const;

  async testConnection(
    account: MailAccountContext
  ): Promise<TestConnectionResult> {
    const transporter = this.createTransporter(account);

    await transporter.verify();

    return { success: true };
  }

  async send(
    account: MailAccountContext,
    message: MailMessage
  ): Promise<SendMailResult> {
    const transporter = this.createTransporter(account);

    const info = await transporter.sendMail({
      from: formatAddress(message.from),
      to: message.to.map(formatAddress),
      cc: message.cc?.map(formatAddress),
      bcc: message.bcc?.map(formatAddress),
      subject: message.subject,
      text: message.text,
      html: message.html
    });

    return {
      providerMessageId: info.messageId,
      rawResponse: info.response
    };
  }

  private createTransporter(
    account: MailAccountContext
  ): Transporter<SMTPTransport.SentMessageInfo> {
    if (!account.smtpConfig) {
      throw new Error("Missing SMTP config for SMTP provider");
    }

    const password = process.env.TEST_SMTP_PASSWORD;

    if (!password) {
      throw new Error("Missing SMTP password in MAILY_USER_PASSWORD");
    }

    const config: SMTPTransport.Options = {
      host: account.smtpConfig.host,
      port: account.smtpConfig.port,
      secure: account.smtpConfig.secure,
      auth: {
        user: account.smtpConfig.username,
        pass: password
      }
    };

    return nodemailer.createTransport(config);
  }
}
