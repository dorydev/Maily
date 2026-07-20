export interface SecretStore {
  set(secretRef: string, value: string): Promise<void>;
  get(secretRef: string): Promise<string>;
  delete(secretRef: string): Promise<void>;
}
