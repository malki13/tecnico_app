# Odoo Work Guides App - TypeScript Edition 🚀

Aplicación móvil profesional en **React Native + TypeScript + Expo** para gestionar guías de trabajo desde Odoo 15.

## ⭐ Por qué TypeScript es Mejor

### ✅ Ventajas sobre JavaScript:

1. **Detección de errores en tiempo de desarrollo**
   ```typescript
   // TypeScript detecta esto ANTES de ejecutar:
   const guide: WorkGuide = {
     id: 1,
     name: "GT-0001",
     state: "opem", // ❌ Error: "opem" no es válido
     // TypeScript sugiere: "open" | "closed" | "draft" | "done"
   };
   ```

2. **Autocompletado inteligente**
   - Tu editor conoce EXACTAMENTE qué propiedades tiene cada objeto de Odoo
   - Menos errores de tipeo en nombres de campos
   - Desarrollo más rápido

3. **Refactoring seguro**
   - Cambias un tipo y TypeScript actualiza TODO el código
   - Sin riesgo de olvidar algún archivo

4. **Documentación automática**
   ```typescript
   interface WorkGuide {
     id: number;           // ← Tu editor muestra esto
     name: string;         // ← mientras escribes código
     state: 'open' | 'closed'; // ← incluyendo valores posibles
   }
   ```

5. **Menos bugs en producción**
   - El 90% de errores se detectan al escribir
   - Especialmente importante con APIs como Odoo

## 🚀 Características

- ✅ **Login tipado** con validación de respuestas Odoo
- ✅ **Listado de guías** con tipos estrictos
- ✅ **Filtro por fecha** type-safe
- ✅ **Menú lateral** con navegación tipada
- ✅ **Información del usuario** con tipos exactos
- ✅ **Cierre de sesión** seguro
- ✅ **SafeArea** en todas las vistas
- ✅ **Tipos para TODAS las respuestas de Odoo**

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Expo CLI: `npm install -g expo-cli`
- Un dispositivo Android/iOS o emulador
- Servidor Odoo 15 corriendo

## 🔧 Instalación

1. **Instala las dependencias:**
```bash
npm install
```

2. **Verifica tipos (opcional pero recomendado):**
```bash
npm run type-check
```

3. **Configura tu servidor Odoo:**

Edita `src/services/odooService.ts` línea 12:

```typescript
// Para desarrollo en tu computadora
const BASE_URL = 'http://localhost:8079';

// Para probar en tu celular (usa la IP de tu computadora)
const BASE_URL = 'http://192.168.1.100:8079';
```

4. **Inicia la aplicación:**
```bash
npm start
```

## 📱 Ejecutar en tu Celular

### Opción 1: Expo Go (Recomendado)

1. Instala **Expo Go**:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Escanea el código QR de la terminal

3. ¡Listo!

### Opción 2: Emulador Android

```bash
npm run android
```

## 📦 Generar APK para Android

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Generar APK
eas build -p android --profile preview
```

## 🏗️ Estructura del Proyecto TypeScript

```
odoo-work-guides-app-ts/
├── src/
│   ├── types/
│   │   └── index.ts                  # 🎯 TODOS los tipos de Odoo
│   ├── services/
│   │   └── odooService.ts            # Servicio API tipado
│   ├── context/
│   │   └── AuthContext.tsx           # Contexto con tipos
│   ├── screens/
│   │   ├── LoginScreen.tsx           # Login tipado
│   │   ├── HomeScreen.tsx            # Lista con tipos
│   │   ├── UserInfoScreen.tsx        # Info tipada
│   │   └── MyWarehouseScreen.tsx     # Bodega
│   ├── components/
│   │   └── CustomDrawerContent.tsx   # Menú tipado
│   └── navigation/
│       └── index.tsx                 # Navegación tipada
├── App.tsx                           # Entrada principal
├── tsconfig.json                     # Configuración TS
└── package.json
```

## 🎯 Tipos Definidos

### Tipos de Odoo disponibles:

```typescript
// Respuesta de login
interface OdooLoginResult {
  uid: number;
  name: string;
  username: string;
  // ... y 20+ campos más con tipos exactos
}

// Guía de trabajo
interface WorkGuide {
  id: number;
  name: string;
  state: 'open' | 'closed' | 'draft' | 'done'; // ← Solo valores válidos
  date: string;
  team_id: [number, string];
}

// Usuario
interface User {
  uid: number;
  name: string;
  username: string;
  partner_id: number;
  company_id: number;
}
```

## 🛡️ Ventajas de TypeScript en este Proyecto

### 1. Respuestas de API Tipadas

```typescript
// ✅ TypeScript sabe EXACTAMENTE qué devuelve cada método
const result: LoginResponse = await OdooService.login(email, password);

if (result.success) {
  // TypeScript sabe que result.user existe aquí
  console.log(result.user.name); // ✅ Autocompletado perfecto
}
```

### 2. Props de Componentes Validados

```typescript
interface HomeScreenProps {
  navigation: DrawerNavigationProp<DrawerParamList, 'Home'>;
}

// ✅ TypeScript valida que navigation tenga todos los métodos
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  navigation.openDrawer(); // ✅ Autocompletado + validación
};
```

### 3. Estados con Tipos Estrictos

```typescript
const [guides, setGuides] = useState<WorkGuide[]>([]);
// ✅ TypeScript sabe que guides es un array de WorkGuide
// ❌ No puedes hacer: setGuides("error") → Error de compilación
```

### 4. Funciones con Contratos Claros

```typescript
const formatDate = (dateString: string): string => {
  // ✅ TypeScript valida entrada y salida
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};
```

## 🔍 Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Verificar tipos (sin ejecutar)
npm run type-check

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Build APK
eas build -p android --profile preview
```

## 🐛 Troubleshooting

### Error de tipos al instalar

```bash
# Limpia cache y reinstala
rm -rf node_modules
npm install
```

### TypeScript muestra errores pero funciona

```bash
# Verifica tipos específicamente
npm run type-check
```

### El editor no muestra autocompletado

1. Reinicia VSCode/tu editor
2. Asegúrate de tener la extensión TypeScript instalada
3. Verifica que `tsconfig.json` existe

## 📊 Comparación JS vs TS

| Característica | JavaScript | TypeScript |
|---------------|-----------|-----------|
| Detección de errores | ⏰ En ejecución | ✅ Al escribir |
| Autocompletado | 🟡 Limitado | ✅ Completo |
| Refactoring | ⚠️ Manual | ✅ Automático |
| Documentación | 📝 Externa | ✅ En el código |
| Curva aprendizaje | ✅ Baja | 🟡 Media |
| Mantenibilidad | 🟡 Difícil | ✅ Fácil |
| Para equipos | ⚠️ Riesgoso | ✅ Ideal |

## 🎓 Aprende TypeScript

Si eres nuevo en TypeScript, estos archivos son un buen punto de inicio:

1. `src/types/index.ts` - Ve cómo se definen tipos
2. `src/services/odooService.ts` - Ve tipos en funciones
3. `src/screens/HomeScreen.tsx` - Ve tipos en componentes

## 📄 Licencia

MIT

---

## 💡 Tip Pro

**TypeScript NO hace tu app más lenta**. Los tipos se eliminan al compilar. Solo te dan superpoderes durante el desarrollo.

**Ejemplo real:**
```typescript
// Sin TypeScript - Bug que llega a producción ❌
const guide = guides.find(g => g.id === "123"); // id es number, no string!

// Con TypeScript - Error detectado al escribir ✅
const guide = guides.find(g => g.id === "123");
                                    ^^^
// Error: Type 'string' no es asignable a type 'number'
```

¡Desarrolla con confianza! 🚀
