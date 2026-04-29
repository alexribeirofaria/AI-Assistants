export class ModelNormalizer {
  public normalize(model?: string | null): string | undefined {
    if (!model) return undefined;

    const normalized = model.trim();
    return normalized || undefined;
  }
}
