import { randomUUID } from "node:crypto";

import { db } from "../client";
import type {
  CreateSmtpAccountInput,
  MailAccount,
  SmtpAccountDetails
} from "../../modules/accounts/accounts.types";

type MailProvider = "smtp" | "gmail" | "microsoft";

type AccountStatus = "connected" | "disconnected" | "error";

type MailAccountRow = {
  id: string;
  user_id: string;
  provider: MailProvider;
  label: string;
  from_email: string;
  from_name: string | null;
  status: AccountStatus;
  last_connection_test_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

type SmtpAccountConfigRow = {
  account_id: string;
  host: string;
  port: number;
  secure: 0 | 1;
  username: string;
  auth_type: "password" | "app_password" | "oauth2";
  secret_ref: string;
};

function mapMailAccountRow(row: MailAccountRow): MailAccount {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    label: row.label,
    fromEmail: row.from_email,
    fromName: row.from_name ?? undefined,
    status: row.status,
    lastConnectionTestAt: row.last_connection_test_at ?? undefined,
    lastError: row.last_error ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function listAccountsByUserId(userId: string): MailAccount[] {
  const rows = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          provider,
          label,
          from_email,
          from_name,
          status,
          last_connection_test_at,
          last_error,
          created_at,
          updated_at
        FROM mail_accounts
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
    )
    .all(userId) as MailAccountRow[];

  return rows.map(mapMailAccountRow);
}

export function findAccountById(
  userId: string,
  accountId: string
): MailAccount | null {
  const row = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          provider,
          label,
          from_email,
          from_name,
          status,
          last_connection_test_at,
          last_error,
          created_at,
          updated_at
        FROM mail_accounts
        WHERE id = ?
          AND user_id = ?
      `
    )
    .get(accountId, userId) as MailAccountRow | undefined;

  if (!row) {
    return null;
  }

  return mapMailAccountRow(row);
}

export function findAccountByUserProviderAndEmail(
  userId: string,
  provider: MailProvider,
  fromEmail: string
): MailAccount | null {
  const row = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          provider,
          label,
          from_email,
          from_name,
          status,
          last_connection_test_at,
          last_error,
          created_at,
          updated_at
        FROM mail_accounts
        WHERE user_id = @userId
          AND provider = @provider
          AND lower(from_email) = lower(@fromEmail)
          LIMIT 1
      `
    )
    .get({
      userId,
      provider,
      fromEmail
    }) as MailAccountRow | undefined;

  if (!row) {
    return null;
  }

  return mapMailAccountRow(row);
}

export function deleteAccountById(
  userId: string,
  accountId: string
): boolean {
  const result = db
    .prepare(
      `
        DELETE FROM mail_accounts
        WHERE id = ?
          AND user_id = ?
      `
    )
    .run(accountId, userId);

  return result.changes > 0;
}

export function createSmtpAccount(
  userId: string,
  input: CreateSmtpAccountInput
): {
  accountId: string;
  secretRef: string;
} {
  const existingAccount = findAccountByUserProviderAndEmail(
    userId,
    "smtp",
    input.fromEmail
  );

  if (existingAccount) {
    throw new Error("SMTP account already exists for this email");
  }

  const accountId = randomUUID();
  const secretRef = `maily.smtp.${accountId}`;

  const insertAccount = db.prepare(`
    INSERT INTO mail_accounts (
      id,
      user_id,
      provider,
      label,
      from_email,
      from_name,
      status
    )
    VALUES (
             @id,
             @userId,
             'smtp',
             @label,
             @fromEmail,
             @fromName,
             'disconnected'
           )
  `);

  const insertSmtpConfig = db.prepare(`
    INSERT INTO smtp_account_configs (
      account_id,
      host,
      port,
      secure,
      username,
      auth_type,
      secret_ref
    )
    VALUES (
             @accountId,
             @host,
             @port,
             @secure,
             @username,
             @authType,
             @secretRef
           )
  `);

  const transaction = db.transaction(() => {
    insertAccount.run({
      id: accountId,
      userId,
      label: input.label,
      fromEmail: input.fromEmail,
      fromName: input.fromName ?? null
    });

    insertSmtpConfig.run({
      accountId,
      host: input.host,
      port: input.port,
      secure: input.secure ? 1 : 0,
      username: input.username,
      authType: input.authType,
      secretRef
    });
  });

  transaction();

  return {
    accountId,
    secretRef
  };
}

export function findSmtpAccountById(
  userId: string,
  accountId: string
): SmtpAccountDetails | null {
  const accountRow = db
    .prepare(
      `
        SELECT
          id,
          user_id,
          provider,
          label,
          from_email,
          from_name,
          status,
          last_connection_test_at,
          last_error,
          created_at,
          updated_at
        FROM mail_accounts
        WHERE id = ?
          AND user_id = ?
          AND provider = 'smtp'
      `
    )
    .get(accountId, userId) as MailAccountRow | undefined;

  if (!accountRow) {
    return null;
  }

  const smtpRow = db
    .prepare(
      `
        SELECT
          account_id,
          host,
          port,
          secure,
          username,
          auth_type,
          secret_ref
        FROM smtp_account_configs
        WHERE account_id = ?
      `
    )
    .get(accountId) as SmtpAccountConfigRow | undefined;

  if (!smtpRow) {
    return null;
  }

  const account = mapMailAccountRow(accountRow);

  return {
    ...account,
    provider: "smtp",
    smtpConfig: {
      accountId: smtpRow.account_id,
      host: smtpRow.host,
      port: smtpRow.port,
      secure: smtpRow.secure === 1,
      username: smtpRow.username,
      authType: smtpRow.auth_type,
      secretRef: smtpRow.secret_ref
    }
  };
}

export function markAccountConnectionSuccess(
  userId: string,
  accountId: string
): void {
  db.prepare(
    `
      UPDATE mail_accounts
      SET
        status = 'connected',
        last_connection_test_at = CURRENT_TIMESTAMP,
        last_error = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
    `
  ).run(accountId, userId);
}

export function markAccountConnectionError(
  userId: string,
  accountId: string,
  errorMessage: string
): void {
  db.prepare(
    `
      UPDATE mail_accounts
      SET
        status = 'error',
        last_connection_test_at = CURRENT_TIMESTAMP,
        last_error = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
    `
  ).run(errorMessage, accountId, userId);
}
