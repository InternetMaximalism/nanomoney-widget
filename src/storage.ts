export class Storage {
  static get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  static set(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  static unset(key: string): boolean {
    if (this.isset(key)) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }

  static clear(): void {
    localStorage.clear();
  }

  static isset(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
