import { randomUUID } from "node:crypto";

import { db } from "../client";

type UserRow = {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export type LocalUser = {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

function mapUserRow(row: UserRow): LocalUser {
  return {
    id: row.id,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function findUserById(userId: string): LocalUser | null {
  const row = db
    .prepare(
      `
      SELECT
        id,
        display_name,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `
    )
    .get(userId) as UserRow | undefined;

  return row ? mapUserRow(row) : null;
}

export function getOrCreateDefaultUser(): LocalUser {
  const existingRow = db
    .prepare(
      `
      SELECT
        id,
        display_name,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at ASC
      LIMIT 1
      `
    )
    .get() as UserRow | undefined;

  if (existingRow) {
    return mapUserRow(existingRow);
  }

  const userId = randomUUID();
  const displayName = process.env.MAILY_DEFAULT_USER_NAME ?? "Doriane";

  db.prepare(
    `
    INSERT INTO users (
      id,
      display_name
    )
    VALUES (
      @id,
      @displayName
    )
    `
  ).run({
    id: userId,
    displayName
  });

  const createdUser = findUserById(userId);

  if (!createdUser) {
    throw new Error("Failed to create default user");
  }

  return createdUser;
}
