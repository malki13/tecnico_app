/**
 * useDebounce Hook
 * Hook para debounce de valores (útil en búsquedas)
 */

import { useState, useEffect } from 'react';

/**
 * Hook que retrasa la actualización de un valor
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup función que cancela el timeout si el valor cambia
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook alternativo que también proporciona el estado de loading
 */
export function useDebounceWithLoading<T>(
  value: T,
  delay: number = 500
): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, isDebouncing];
}
