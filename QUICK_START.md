# 🚀 CargoBack — Quick Start

## Ejecuta esto y listo:

```bash
npm run dev
```

## Eso es todo. La app abre en http://localhost:5173

---

## ¿Qué se implementó?

✅ **Flujo completo de autenticación**
- Pantalla de bienvenida
- Ingreso de teléfono (con prefijos de país)
- Verificación OTP (6 cajas, auto-submit)
- Setup de perfil (nombre, camión, tonelaje)

✅ **Estado global (Zustand)**
- Persiste en localStorage
- Se recupera automáticamente al reabrir
- Token + datos del conductor guardados

✅ **Modo Demo**
- **No requiere Firebase configurado**
- OTP: `123456` para testing
- Simula usuarios nuevos y existentes
- Perfecto para hackathon

✅ **Guard en App.tsx**
- Si no hay `driver` → muestra auth
- Si hay `driver` → muestra home normal

---

## Testing

### Flujo típico:
```
1. Abre app → Welcome
2. "Entrar con mi teléfono"
3. Número: 300 123 4567 (cualquiera)
4. Click "Recibir código"
5. OTP: 123456
6. Completa: nombre, camión, tonelaje
7. ✅ Directo al Home autenticado
```

### Reabrir app:
```
- Si cierra y reabre: la sesión se recupera
- Si vacía localStorage: repite el flow de auth
```

---

## Estructura creada

```
src/
├── config/
│   └── firebaseConfig.ts          ← (Para Firebase real, después)
├── store/
│   └── authStore.ts               ← Estado global, persist con localStorage
├── services/
│   └── authService.ts             ← Demo mode OTP, Firebase real (commented)
└── app/
    ├── screens/auth/
    │   ├── AuthLayout.tsx         ← Orquesta navegación
    │   ├── WelcomeScreen.tsx
    │   ├── PhoneScreen.tsx
    │   ├── OTPScreen.tsx           ← Auto-paste, auto-submit
    │   ├── ProfileSetupScreen.tsx
    │   └── index.ts
    └── App.tsx                    ← Guard: !driver → AuthLayout
```

---

## Cómo cambiar a Firebase Real (cuando sea el momento)

Ver **AUTH_SETUP.md** → sección "Cambiar a Firebase Real"

Resumen:
1. Firebase Console: crea proyecto, habilita Phone Auth
2. Copia credenciales a `firebaseConfig.ts`
3. Descomenta líneas en `authService.ts`
4. Cambia `.env`: `VITE_AUTH_DEMO=false`

---

## Notas

- Todo está **tipado con TypeScript**
- Usa **Zustand** para estado (super simple)
- Componentes con **motion/react** para animaciones
- **Responsive** y listo para web

Listo para el hackathon 💪
