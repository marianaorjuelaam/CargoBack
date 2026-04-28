# CargoBack — Setup de Autenticación

## ¿Ya está listo para usar?

**SÍ.** Todo está configurado en **modo demo**. Solo ejecuta:

```bash
npm run dev
```

Y se abrirá con el flujo completo de autenticación. Para testing:
- **OTP:** `123456`
- El número de teléfono puede ser cualquiera

---

## Flujo de Autenticación

### Demo Mode (VITE_AUTH_DEMO=true)
- ✅ Simula SMS sin costo
- ✅ No requiere credenciales de Firebase
- ✅ Perfecto para desarrollo y hackathon
- ❌ Los datos no persisten en un servidor real

### Modo Producción (Firebase real)
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita "Authentication → Phone"
3. Copia credenciales a `src/config/firebaseConfig.ts`
4. Cambia `VITE_AUTH_DEMO=false` en `.env`

---

## Cómo funciona

### Pantallas

1. **Welcome** — Dos botones: Teléfono o Google
2. **Phone** — Ingresa número, se envía OTP
3. **OTP** — 6 cajas para código, auto-submit
4. **Profile** — Nombre, tipo camión, tonelaje
5. → **Home** (autenticado)

### Estado Global (Zustand)

```typescript
const { driver, token, status, error } = useAuthStore();

// Actions
await useAuthStore.getState().sendOTP(phone);
await useAuthStore.getState().verifyOTP(code);
```

### Persistencia

El token y datos del conductor se guardan en `localStorage` automáticamente.
En próximos abiertos de la app:
- Si sesión válida → directo al Home
- Si expirada → solo pide OTP

---

## Endpoints que necesita tu backend (cuando no sea demo)

### POST `/api/auth/send-otp`
```json
{ "phone": "+57300123456" }
→ { "verificationId": "..." }
```

### POST `/api/auth/verify-otp`
```json
{
  "phone": "+57300123456",
  "code": "123456",
  "verificationId": "..."
}
→ {
  "token": "jwt...",
  "isNewUser": true,
  "driver": { ... }
}
```

### POST `/api/driver/profile`
```json
{
  "phone": "+57300123456",
  "name": "Carlos",
  "truckType": "general",
  "capacityTons": 10
}
```

---

## Testing

### Pasar por el flujo:
```
1. Abre app → Welcome
2. Click "Entrar con mi teléfono"
3. Ingresa número cualquiera (mín 9 dígitos)
4. Click "Recibir código"
5. Ingresa OTP: 123456
6. Completa perfil
7. → App carga con conductor autenticado
```

### Logout y reingreso:
```
// Cerrar sesión (agregar botón en Home)
useAuthStore.getState().logout()

// Cuando reabre la app → muestra teléfono pre-llenado
```

---

## Cambiar a Firebase Real

Una vez que tengas credenciales:

**1. Actualiza `src/config/firebaseConfig.ts`:**
```typescript
const firebaseConfig = {
  apiKey: 'tu_key',
  authDomain: 'tu_project.firebaseapp.com',
  projectId: 'tu_project',
  // ...
};
```

**2. Descomenta el código en `src/services/authService.ts`:**
```typescript
// Líneas 65-75: Descomenta signInWithPhoneNumber
// Líneas 107-120: Descomenta PhoneAuthProvider.credential
```

**3. Cambia el `.env`:**
```
VITE_AUTH_DEMO=false
```

**4. Reinicia la app:**
```bash
npm run dev
```

---

## Troubleshooting

### "No pudimos enviar el código"
- Modo demo: revisá que el número tenga mín 9 dígitos
- Modo Firebase: revisá credenciales en Firebase Console

### OTP no llega
- **Demo:** OTP es siempre `123456`
- **Real:** Firebase envía SMS real. Si no funciona:
  - Verificá que el país esté habilitado en Firebase
  - Revisá cuota de SMS

### Sesión no persiste
- localStorage está guardando en caché
- Abre DevTools → Application → Storage → localStorage
- Debería ver `cargoback-auth` con los datos

---

## Estructura de archivos

```
src/
├── config/
│   └── firebaseConfig.ts          ← Config de Firebase
├── store/
│   └── authStore.ts               ← Estado global (Zustand)
├── services/
│   └── authService.ts             ← Lógica de auth
└── app/
    ├── screens/auth/
    │   ├── AuthLayout.tsx         ← Navegación entre pantallas
    │   ├── WelcomeScreen.tsx
    │   ├── PhoneScreen.tsx
    │   ├── OTPScreen.tsx
    │   └── ProfileSetupScreen.tsx
    └── App.tsx                    ← Guard: si !driver → AuthLayout
```

---

## Próximos pasos

- [ ] Integrar con tu backend
- [ ] Reemplazar credenciales de Firebase
- [ ] Agregar Google Sign-In real
- [ ] Agregar persistencia en servidor (Firestore)
- [ ] Implementar logout en Home
- [ ] Agregar foto de perfil y licencia

Listo para coproduc 🚀
