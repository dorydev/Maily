import type { MailProvider, MailProviderKind } from "./mail-provider.interface";

export class MailProviderRegistry {
  private readonly providers = new Map<MailProviderKind, MailProvider>();

  register(provider: MailProvider): void {
    this.providers.set(provider.kind, provider);
  }

  get(kind: MailProviderKind): MailProvider {
    const provider = this.providers.get(kind);

    if (!provider) {
      throw new Error(`Unsupported mail provider: ${kind}`);
    }

    return provider;
  }
}
