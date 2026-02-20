/**
 * Storage Utilities
 * Funciones auxiliares para AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Guarda un valor en storage
 */
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

/**
 * Obtiene un valor de storage
 */
export const getItem = async <T = any>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
};

/**
 * Elimina un valor de storage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
};

/**
 * Limpia todo el storage
 */
export const clear = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Guarda múltiples valores
 */
export const setMultiple = async (
  items: Array<[string, any]>
): Promise<void> => {
  try {
    const pairs = items.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    console.error('Error saving multiple items:', error);
    throw error;
  }
};

/**
 * Obtiene múltiples valores
 */
export const getMultiple = async <T = any>(
  keys: string[]
): Promise<Record<string, T | null>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    return pairs.reduce((acc, [key, value]) => {
      acc[key] = value ? JSON.parse(value) : null;
      return acc;
    }, {} as Record<string, T | null>);
  } catch (error) {
    console.error('Error reading multiple items:', error);
    return {};
  }
};

/**
 * Elimina múltiples valores
 */
export const removeMultiple = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple items:', error);
    throw error;
  }
};

/**
 * Obtiene todas las keys del storage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};
