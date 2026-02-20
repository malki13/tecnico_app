/**
 * Validators
 * Funciones para validar datos
 */

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida una contraseña (mínimo 6 caracteres)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valida un teléfono
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Valida una cédula ecuatoriana (10 dígitos)
 */
export const isValidCedula = (cedula: string): boolean => {
  const cleaned = cedula.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Valida que un campo no esté vacío
 */
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida longitud mínima
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Valida longitud máxima
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Valida un rango numérico
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida una URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
