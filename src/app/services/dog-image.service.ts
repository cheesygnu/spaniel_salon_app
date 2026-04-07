import { Injectable } from '@angular/core';

const DB_NAME = 'SpanielSalonDB';
const STORE_NAME = 'dogPhotos';
const DB_VERSION = 1;

@Injectable({
  providedIn: 'root'
})
export class DogImageService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDb();
  }

  private initDb(): void {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => console.error('IndexedDB open failed:', request.error);
    request.onsuccess = () => {
      this.db = request.result;
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'filename' });
      }
    };
  }

  private async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
    });
  }

  async saveImage(filename: string, blob: Blob): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ filename, blob });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getImage(filename: string): Promise<Blob | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(filename);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.blob ?? null);
      };
    });
  }

  async deleteImage(filename: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(filename);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /** Stub for future Firebase Storage sync */
  async syncToFirebase(filename: string): Promise<void> {
    // TODO: implement when syncing to Firebase Storage
  }

  /** Stub for future Firebase Storage sync */
  async syncFromFirebase(filename: string): Promise<void> {
    // TODO: implement when syncing from Firebase Storage
  }
}
