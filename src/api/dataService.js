import { appParams } from '@/lib/app-params';

/**
 * Data Service
 * Handles data management and persistence
 * Uses localStorage for data storage
 */

class DataService {
  constructor() {
    this.appId = appParams.appId;
    this.token = appParams.token;
    this.baseUrl = appParams.appBaseUrl;
    this.entities = {
      User: new EntityAPI('User'),
      DailyReport: new EntityAPI('DailyReport'),
      Measurement: new EntityAPI('Measurement'),
      FoodItem: new EntityAPI('FoodItem'),
    };
  }
}

class EntityAPI {
  constructor(entityName) {
    this.entityName = entityName;
    this.storageKey = `vitality_${entityName}`;
    this.legacyStorageKey = `base44_${entityName}`; // For migration
  }

  getStorage() {
    if (typeof window === 'undefined') return [];
    try {
      // Try new storage key first
      let data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }

      // Fall back to legacy storage key for migration
      data = localStorage.getItem(this.legacyStorageKey);
      if (data) {
        const parsed = JSON.parse(data);
        // Migrate to new key
        this.setStorage(parsed);
        return parsed;
      }

      return [];
    } catch (error) {
      console.error(`Error reading ${this.entityName} from storage:`, error);
      return [];
    }
  }

  setStorage(data) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${this.entityName} to storage:`, error);
    }
  }

  async list(sortBy = '-date', limit = 100) {
    try {
      let data = this.getStorage();
      // Sort by date descending
      data = data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      return data.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching ${this.entityName} list:`, error);
      return [];
    }
  }

  async filter(query) {
    try {
      let data = this.getStorage();
      // Filter by query properties
      return data.filter((item) => {
        return Object.keys(query).every((key) => item[key] === query[key]);
      });
    } catch (error) {
      console.error(`Error filtering ${this.entityName}:`, error);
      return [];
    }
  }

  async create(data) {
    try {
      const allData = this.getStorage();
      const newItem = { ...data, id: Date.now().toString() };
      allData.push(newItem);
      this.setStorage(allData);
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.entityName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const allData = this.getStorage();
      const index = allData.findIndex((item) => item.id === id);
      if (index > -1) {
        allData[index] = { ...allData[index], ...data };
        this.setStorage(allData);
        return allData[index];
      }
      return data;
    } catch (error) {
      console.error(`Error updating ${this.entityName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const allData = this.getStorage();
      const filtered = allData.filter((item) => item.id !== id);
      this.setStorage(filtered);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw error;
    }
  }
}

export const dataService = new DataService();
