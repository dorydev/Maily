import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { SecretStore } from "./secret-store.types";

type SecretFileContent = Record<string, string>;

export class DevSecretStore implements SecretStore {
  private readonly filePath: string;

  constructor(filePath = resolve(process.cwd(), ".secrets.dev.json")) {
    this.filePath = filePath;
  }

  async set(secretRef: string, value: string): Promise<void> {
    const secrets = await this.readSecrets();

    secrets[secretRef] = value;

    await this.writeSecrets(secrets);
  }

  async get(secretRef: string): Promise<string> {
    const secrets = await this.readSecrets();
    const value = secrets[secretRef];

    if (!value) {
      throw new Error(`Secret not found: ${secretRef}`);
    }

    return value;
  }

  async delete(secretRef: string): Promise<void> {
    const secrets = await this.readSecrets();

    if (!(secretRef in secrets)) {
      return;
    }

    delete secrets[secretRef];

    await this.writeSecrets(secrets);
  }

  private async readSecrets(): Promise<SecretFileContent> {
    if (!existsSync(this.filePath)) {
      return {};
    }

    const rawContent = await readFile(this.filePath, "utf-8");

    if (rawContent.trim() === "") {
      return {};
    }

    return JSON.parse(rawContent) as SecretFileContent;
  }

  private async writeSecrets(secrets: SecretFileContent): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });

    await writeFile(this.filePath, JSON.stringify(secrets, null, 2), {
      encoding: "utf-8",
      mode: 0o600
    });
  }
}
