export class ProviderNormalizer {
  public normalize(providers?: string[] | null): string[] {
    if (!Array.isArray(providers)) return [];

    return providers
      .map(p => p?.trim())
      .filter(Boolean) as string[];
  }
}
