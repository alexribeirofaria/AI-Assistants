import { ExpiringValueCache } from './expiring-value-cache';

export abstract class CachedDomainListMixin {
  protected readonly _domainCacheTtlSeconds: number = 30.0;
  protected readonly _domainCacheMaxItems: number = 50;

  private readonly _domainCache: ExpiringValueCache<readonly string[]> = new ExpiringValueCache<readonly string[]>(this._domainCacheTtlSeconds);

  protected abstract _fetchDomainNames(): string[];

  protected getDomainNamesCached(): string[] {
    const cachedNames = this._domainCache.getOrSet(() => this._fetchDomainNamesSnapshot());
    return Array.from(cachedNames);
  }

  private _fetchDomainNamesSnapshot(): readonly string[] {
    const names = this._fetchDomainNames();
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

  getDomainView(prefix: string = '- '): string[] {
    const names = this.getDomainNamesCached();
    return names.map(name => `${prefix}${this._cleanName(name)}`);
  }

  clearDomainCache(): void {
    this._domainCache.clear();
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
