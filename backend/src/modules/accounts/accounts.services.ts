import {
  createSmtpAccount,
  deleteAccountById,
  findAccountById,
  findSmtpAccountById,
  listAccountsByUserId,
  markAccountConnectionError,
  markAccountConnectionSuccess
} from "../../database/repositories/accounts.repository";
import { SmtpProvider } from "../../providers/smtp/smtp.provider";
import type {
  CreateSmtpAccountInput,
  MailAccount,
  SmtpAccountDetails
} from "./accounts.types";
import { DevSecretStore } from "../auth/dev-secret-store.services";

const smtpProvider = new SmtpProvider();
const secretStore = new DevSecretStore();

export function getAccounts(userId: string): MailAccount[] {
  return listAccountsByUserId(userId);
}

export function getAccount(
  userId: string,
  accountId: string
): MailAccount {
  const account = findAccountById(userId, accountId);

  if (!account) {
    throw new Error(`Account not found: ${accountId}`);
  }

  return account;
}

export function deleteAccount(
  userId: string,
  accountId: string
): void {
  const deleted = deleteAccountById(userId, accountId);

  if (!deleted) {
    throw new Error(`Account not found: ${accountId}`);
  }
}

export async function registerSmtpAccount(
  userId: string,
  input: CreateSmtpAccountInput
): Promise<string> {
  const { accountId, secretRef } = createSmtpAccount(userId, input);

  await secretStore.set(secretRef, input.password);

  return accountId;
}

export function getSmtpAccount(
  userId: string,
  accountId: string
): SmtpAccountDetails {
  const account = findSmtpAccountById(userId, accountId);

  if (!account) {
    throw new Error(`SMTP account not found: ${accountId}`);
  }

  return account;
}

export async function testSmtpAccountConnection(
  userId: string,
  accountId: string
): Promise<void> {
  const account = getSmtpAccount(userId, accountId);

  try {
    const smtpPassword = await secretStore.get(account.smtpConfig.secretRef);

    await smtpProvider.testConnection({
      accountId: account.id,
      provider: "smtp",
      fromEmail: account.fromEmail,
      fromName: account.fromName,
      smtpConfig: account.smtpConfig,
      smtpPassword
    });

    markAccountConnectionSuccess(userId, accountId);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown SMTP connection error";

    markAccountConnectionError(userId, accountId, errorMessage);

    throw error;
  }
}
