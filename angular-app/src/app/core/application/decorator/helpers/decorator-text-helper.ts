export class DecoratorTextHelper {
  static normalizeText(text: string): string {
    const cleaned = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ');
    return cleaned.split(' ').filter(Boolean).join(' ');
  }

  static bestMatch(text: string, options: string[], cutoff: number): string | null {
    // Simple exact + fuzzy match (difflib equivalent)
    const normalizedText = this.normalizeText(text);
    for (const option of options) {
      const normalizedOption = this.normalizeText(option);
      if (normalizedText === normalizedOption || normalizedText.includes(normalizedOption)) {
        return option;
      }
    }
    // Basic similarity score
    let bestScore = 0;
    let bestMatch = null;
    for (const option of options) {
      const score = this.similarity(normalizedText, this.normalizeText(option));
      if (score > bestScore && score >= cutoff) {
        bestScore = score;
        bestMatch = option;
      }
    }
    return bestMatch;
  }

  private static similarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const matches = shorter.split('').reduce((acc, char, i) => acc + (char === longer[i] ? 1 : 0), 0);
    return matches / longer.length;
  }
}
