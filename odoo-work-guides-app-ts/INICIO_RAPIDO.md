# 🚀 Guía Rápida - TypeScript Edition

## ⚡ Inicio Super Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Verificar que todo está bien tipado (opcional)
npm run type-check

# 3. Iniciar
npm start
```

## 🎯 ¿Por qué elegiste TypeScript?

### Ventajas REALES que verás HOY:

1. **Autocompletado Mágico** ✨
   ```typescript
   const guide = guides[0];
   guide. // ← Tu editor te muestra: id, name, state, date, team_id
   ```

2. **Errores Antes de Ejecutar** 🛡️
   ```typescript
   // ❌ JavaScript: Error en producción
   setGuides("error"); // Boom! 💥 en el celular del usuario
   
   // ✅ TypeScript: Error al escribir
   setGuides("error"); // Línea roja inmediata, no compila
   ```

3. **Documentación Gratis** 📚
   ```typescript
   // Pasas el mouse sobre cualquier variable y ves TODO:
   const user: User = {
     uid: number,      // ← Esto aparece automáticamente
     name: string,     // ← en tu editor mientras programas
   }
   ```

## 🔥 Diferencias que Notarás

### En JavaScript (.js):
```javascript
const loadGuides = async () => {
  const result = await OdooService.getAllGuides();
  // 🤷 ¿Qué tiene result? ¿success? ¿data? ¿guides?
  // Tienes que revisar el código o la documentación
  if (result.success) {
    setGuides(result.guides); // Espero que sea guides...
  }
};
```

### En TypeScript (.ts):
```typescript
const loadGuides = async (): Promise<void> => {
  const result: GuidesResponse = await OdooService.getAllGuides();
  // ✅ Tu editor SABE que result tiene: success, guides?, error?
  if (result.success) {
    setGuides(result.guides!); // ✅ Autocompletado perfecto
    //           ^^^^^^ Tu editor sugiere esto automáticamente
  }
};
```

## 📝 Scripts Disponibles

```bash
npm start           # Iniciar Expo
npm run type-check  # Verificar tipos (NO ejecuta, solo chequea)
npm run android     # Ejecutar en Android
npm run ios         # Ejecutar en iOS
```

## ⚙️ Configuración Rápida

### 1. Cambiar IP del Servidor

**Archivo:** `src/services/odooService.ts` (línea 12)

```typescript
const BASE_URL = 'http://192.168.1.100:8079'; // ← Tu IP aquí
```

### 2. Cambiar Nombre de BD (opcional)

**Archivo:** `src/services/odooService.ts` (línea 13)

```typescript
const DB_NAME = 'tu_base_datos'; // ← Tu BD aquí
```

## 🎨 Archivos Importantes

| Archivo | Qué hace |
|---------|----------|
| `src/types/index.ts` | 🎯 **TODOS** los tipos de Odoo |
| `src/services/odooService.ts` | 📡 Comunicación con API |
| `src/screens/HomeScreen.tsx` | 📋 Lista de guías |
| `src/screens/LoginScreen.tsx` | 🔐 Pantalla de login |
| `tsconfig.json` | ⚙️ Configuración TypeScript |

## 💡 Tips TypeScript

### 1. Ver Tipo de una Variable

```typescript
// Pasa el mouse sobre cualquier variable
const user = await OdooService.getUserData();
//    ^^^^ Aparece: const user: User | null
```

### 2. Ver Parámetros de Función

```typescript
// Escribe el paréntesis y aparecen los parámetros
login(
//    ^^^ Aparece: (email: string, password: string) => Promise<LoginResponse>
```

### 3. Si TypeScript se Queja

```typescript
// A veces TypeScript es muy estricto
// Opción 1: Arreglar el tipo (recomendado)
const guides: WorkGuide[] = [];

// Opción 2: Usar "any" (no recomendado, pero funciona)
const guides: any = [];

// Opción 3: Usar "!" si estás seguro que no es null
const user = guides.find(g => g.id === 1)!;
//                                       ^ "estoy seguro que existe"
```

## 🚨 Errores Comunes y Soluciones

### Error: "Type X is not assignable to type Y"

```typescript
// ❌ Error
const guide: WorkGuide = {
  id: "1", // ← String, pero debería ser number
  // ...
};

// ✅ Solución
const guide: WorkGuide = {
  id: 1, // ← Number
  // ...
};
```

### Error: "Object is possibly null"

```typescript
// ❌ Error
const user = await getUserData();
console.log(user.name); // ← user puede ser null

// ✅ Solución 1: Verificar
if (user) {
  console.log(user.name);
}

// ✅ Solución 2: Operador "!"
console.log(user!.name); // "confío que no es null"

// ✅ Solución 3: Optional chaining
console.log(user?.name); // undefined si user es null
```

### Error: "Cannot find module"

```typescript
// ❌ Error
import OdooService from './odooService'; // Falta extensión

// ✅ Solución - NO pongas extensión en imports TS
import OdooService from './odooService'; // Correcto, sin .ts
```

## 📱 Para Generar APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## 🎯 Checklist Pre-Inicio

- [ ] `npm install` ejecutado
- [ ] IP cambiada en `odooService.ts` si usas celular
- [ ] `npm run type-check` sin errores (opcional)
- [ ] Expo Go instalado en celular
- [ ] Odoo corriendo
- [ ] Celular y PC en misma WiFi

## 🆚 JavaScript vs TypeScript - Tu Proyecto

| Situación | JavaScript | TypeScript |
|-----------|-----------|-----------|
| Escribes `guide.` | 🤷 No sabe qué hay | ✅ Muestra: id, name, state... |
| Escribes `result.` | 🤷 ¿Qué tiene? | ✅ Muestra: success, guides, error |
| Error en tipo | ⏰ En producción | ✅ Al escribir |
| Cambias estructura | ⚠️ Buscas a mano | ✅ TypeScript avisa |
| Nuevo en el equipo | 📚 Lee docs | ✅ Los tipos son la doc |

## 🔥 Ventaja REAL Ejemplo

**Sin TypeScript (JavaScript):**
```javascript
// Odoo cambió el API, ahora state es "estado"
const guides = await getGuides();
guides.map(g => g.state); // ❌ undefined, app rompe en producción
```

**Con TypeScript:**
```typescript
// Odoo cambió el API
const guides = await getGuides();
guides.map(g => g.state); 
           //     ^^^^^ ERROR: Property 'state' does not exist
// ✅ TypeScript te avisa ANTES de publicar la app
```

---

## 💪 Siguiente Paso

¡Abre `src/types/index.ts` y mira cómo están definidos los tipos de Odoo!

Es la clave para entender el poder de TypeScript. 🚀
