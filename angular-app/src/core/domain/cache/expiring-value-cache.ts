export class ExpiringValueCache<T> {
  private ttlSeconds: number;
  private value: T | null = null;
  private timestamp: number | null = null;
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(ttlSeconds: number) {
    this.ttlSeconds = ttlSeconds;
  }

  private now(): number {
    return performance.now() / 1000;
  }

  private isExpired(): boolean {
    if (this.value === null || this.timestamp === null) {
      return true;
    }
    return (this.now() - this.timestamp) >= this.ttlSeconds;
  }

  private _clearInternal(): void {
    this.value = null;
    this.timestamp = null;
  }

  hasValue(): boolean {
    if (this.isExpired()) {
      if (this.value !== null || this.timestamp !== null) {
        this.evictions++;
      }
      this._clearInternal();
      return false;
    }
    return true;
  }

  get(): T | null {
    if (this.isExpired()) {
      if (this.value !== null || this.timestamp !== null) {
        this.evictions++;
      }
      this._clearInternal();
      this.misses++;
      return null;
    }
    this.hits++;
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    this.timestamp = this.now();
  }

  clear(): void {
    this._clearInternal();
  }

  getOrSet(fetchFn: () => T): T {
    const cached = this.get();
    if (cached !== null) {
      return cached;
    }
    const value = fetchFn();
    this.set(value);
    return value;
  }

  getStats(): {
    hits: number;
    misses: number;
    evictions: number;
    hasValue: boolean;
  } {
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hasValue: this.value !== null && this.timestamp !== null && !this.isExpired(),
    };
  }
}
