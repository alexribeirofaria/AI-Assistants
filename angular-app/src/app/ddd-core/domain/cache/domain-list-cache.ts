import { ExpiringValueCache } from './expiring-value-cache';

export abstract class CachedDomainListMixin {
  protected readonly _domainCacheTtlSeconds: number = 30.0;
  protected readonly _domainCacheMaxItems: number = 50;

  private readonly _domainCache: ExpiringValueCache<readonly string[]> = new ExpiringValueCache<readonly string[]>(this._domainCacheTtlSeconds);
  private _pendingDomainNames: Promise<readonly string[]> | null = null;

  protected abstract _fetchDomainNames(): string[] | Promise<string[]>;

  protected async getDomainNamesCached(): Promise<string[]> {
    const cachedNames = this._domainCache.get();
    if (cachedNames !== null) {
      return Array.from(cachedNames);
    }

    if (!this._pendingDomainNames) {
      this._pendingDomainNames = this._fetchDomainNamesSnapshot()
        .then((snapshot) => {
          this._domainCache.set(snapshot);
          return snapshot;
        })
        .finally(() => {
          this._pendingDomainNames = null;
        });
    }

    return Array.from(await this._pendingDomainNames);
  }

  private async _fetchDomainNamesSnapshot(): Promise<readonly string[]> {
    const names = await this._fetchDomainNames();
    const sanitized = new Set(names.map(name => this._cleanName(name.trim())).filter(Boolean));
    const ordered = Array.from(sanitized).sort().slice(0, this._domainCacheMaxItems);
    return ordered as readonly string[];
  }

  protected _cleanName(name: string): string {
    if (name.includes('/')) {
      return (name.split('/').pop() || name).trim();
    }
    return name;
  }

  async getDomainView(prefix: string = '- '): Promise<string[]> {
    const names = await this.getDomainNamesCached();
    return names.map(name => `${prefix}${this._cleanName(name)}`);
  }

  clearDomainCache(): void {
    this._domainCache.clear();
    this._pendingDomainNames = null;
  }

  getDomainCacheStats(): {
    hits: number;
    misses: number;
    evictions: number;
    hasValue: boolean;
  } {
    return this._domainCache.getStats();
  }
}
