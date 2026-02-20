/**
 * Formatter Utilities
 * Funciones para formatear diferentes tipos de datos
 */

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca un texto largo
 */
export const truncate = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formatea un número de teléfono
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remover caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según longitud
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

/**
 * Formatea una cédula/identificación
 */
export const formatCedula = (cedula: string): string => {
  if (!cedula) return '';
  
  const cleaned = cedula.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return cedula;
};

/**
 * Formatea una dirección MAC
 */
export const formatMAC = (mac: string): string => {
  if (!mac) return '';
  
  const cleaned = mac.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  
  if (cleaned.length === 12) {
    return cleaned.match(/.{1,2}/g)?.join(':') || mac;
  }
  
  return mac;
};

/**
 * Formatea un número con separador de miles
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formatea un monto de dinero
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea bytes a tamaño legible
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Convierte texto a kebab-case
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Convierte texto a camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
};

/**
 * Formatea un nombre completo
 */
export const formatFullName = (firstName: string, lastName: string): string => {
  const first = capitalize(firstName.trim());
  const last = capitalize(lastName.trim());
  return `${first} ${last}`.trim();
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
  
  return initials;
};

/**
 * Limpia y normaliza texto
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .toLowerCase()
    .trim();
};

/**
 * Formatea un serial number para mejor legibilidad
 */
export const formatSerialNumber = (serial: string): string => {
  if (!serial) return '';
  
  // Agregar espacios cada 4 caracteres
  return serial.trim().replace(/(.{4})/g, '$1 ').trim();
};

/**
 * Enmascara información sensible
 */
export const maskSensitiveData = (
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string => {
  if (!data || data.length <= visibleChars) return data;
  
  const visible = data.slice(-visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);
  
  return masked + visible;
};

/**
 * Formatea un email ocultando parte del dominio
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  const visibleLocal = Math.min(3, Math.floor(localPart.length / 2));
  
  return `${localPart.substring(0, visibleLocal)}***@${domain}`;
};
