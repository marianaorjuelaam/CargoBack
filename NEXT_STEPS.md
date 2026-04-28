# 📋 Next Steps — Después del Hackathon

## Si pasaste el hackathon y ahora toca producción:

### Phase 1: Firebase Real (1-2 horas)
- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar "Authentication → Phone"
- [ ] Copiar credenciales a `src/config/firebaseConfig.ts`
- [ ] Descomenta líneas en `src/services/authService.ts`
- [ ] Cambiar `.env`: `VITE_AUTH_DEMO=false`
- [ ] Test: flujo completo con SMS real

### Phase 2: Backend Integration (2-4 horas)
- [ ] POST `/api/auth/send-otp` — verifica número, envía OTP
- [ ] POST `/api/auth/verify-otp` — verifica código, crea JWT
- [ ] POST `/api/driver/profile` — guarda datos del conductor
- [ ] GET `/api/driver/profile` — recupera datos existentes
- [ ] Base de datos: tabla `drivers` (phone, name, truckType, capacityTons, createdAt, updatedAt)

### Phase 3: Logout & Session Management (1 hora)
- [ ] Agregar botón "Logout" en Home (top-right)
- [ ] `logout()` → borra localStorage + token
- [ ] Token refresh: detectar expiración, pedir OTP nuevamente
- [ ] Protección de rutas: redirect a auth si no hay token

### Phase 4: Fotos y Documentos (2-3 horas)
- [ ] Después de Profile: upload de foto de perfil
- [ ] Después de foto: upload de foto de licencia
- [ ] Validar: documentos claros, legibles
- [ ] Cloud Storage: guardar archivos

### Phase 5: Validaciones Avanzadas (1 hora)
- [ ] Verificar número no duplicado
- [ ] Verificar licencia válida (OCR posterior)
- [ ] Limite de intentos OTP (5 intentos, esperar 1 hora)
- [ ] Rate limiting en endpoints

### Phase 6: Google Sign-In Real (1-2 horas)
- [ ] Implementar `signInWithPopup` de Firebase
- [ ] OAuth credentials en Firebase Console
- [ ] Crear/actualizar usuario en BD si es Google
- [ ] Mapear email de Google → teléfono falso para DB

### Phase 7: Push Notifications (opcional pero recomendado)
- [ ] Firebase Cloud Messaging (FCM)
- [ ] Avisar cuando hay carga disponible
- [ ] Recordar que dejó búsqueda activa
- [ ] Ofertas que expirarán pronto

### Phase 8: Analytics & Monitoring (1 hora)
- [ ] Firebase Analytics
- [ ] Track: signup completion rate
- [ ] Track: OTP verification rate
- [ ] Track: profile completion rate
- [ ] Datadog o similar para errores

---

## 🏗️ Arquitectura Recomendada para Backend

```
backend/
├── routes/
│   └── auth.js
│       ├── POST /api/auth/send-otp
│       ├── POST /api/auth/verify-otp
│       └── POST /api/auth/refresh-token
├── routes/
│   └── driver.js
│       ├── POST /api/driver/profile
│       ├── GET /api/driver/profile
│       └── PUT /api/driver/profile
├── middleware/
│   └── authGuard.js (verifica JWT)
├── models/
│   └── Driver.js (Mongoose/Prisma)
└── services/
    ├── twilioService.js (o Firebase SMS)
    └── jwtService.js
```

---

## 📊 BD Schema (Ejemplo)

### `drivers` table
```sql
CREATE TABLE drivers (
  id UUID PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  truckType ENUM('general', 'refrigerated', 'tanker', 'flatbed'),
  capacityTons INT,
  photoUrl VARCHAR(500),
  licensePhotoUrl VARCHAR(500),
  licenseExpiry DATE,
  rating FLOAT DEFAULT 5.0,
  tripsCompleted INT DEFAULT 0,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  deletedAt TIMESTAMP NULL
);

CREATE INDEX idx_drivers_phone ON drivers(phone);
```

### `otp_attempts` table (rate limiting)
```sql
CREATE TABLE otp_attempts (
  id UUID PRIMARY KEY,
  phone VARCHAR(20),
  attempts INT DEFAULT 0,
  lastAttemptAt TIMESTAMP,
  expiresAt TIMESTAMP
);
```

---

## 🔐 Security Checklist

- [ ] JWT con expiry corto (15 min)
- [ ] Refresh token con expiry largo (7 días)
- [ ] CORS configurado correctamente
- [ ] Rate limiting en auth endpoints
- [ ] Validar teléfono con internacional formato
- [ ] Encriptar licencia y datos sensibles en BD
- [ ] HTTPS obligatorio (no HTTP)
- [ ] Helmet.js para headers de seguridad
- [ ] Input validation y sanitización
- [ ] Never log tokens o números de teléfono

---

## 📱 Mobile-Ready Checklist

- [ ] Probar en devices reales (no solo browser)
- [ ] Test con 3G/4G lento
- [ ] Test sin conexión → error message claro
- [ ] Test con teclado virtual (no oculta inputs)
- [ ] Iconos legibles en pantallas pequeñas
- [ ] Botones >= 48px (Apple) o 48dp (Android)
- [ ] Touch-friendly: gap mínimo 8px entre botones

---

## 💾 Data Persistence Strategy

```
Frontend (localStorage):
├─ driver (actualizar si profile cambia)
├─ token (refresco cada 15 min)
└─ lastActivity (para timeout)

Backend (BD):
├─ driver profile (source of truth)
├─ otp_attempts (validación)
└─ jwt_blacklist (logout)
```

---

## 🎯 Metrics a Trackear

```
Signup Funnel:
└─ Welcome views
   └─ Phone input starts (Conv: 60%)
      └─ OTP sent (Conv: 90%)
         └─ OTP verified (Conv: 85%)
            └─ Profile completed (Conv: 95%)
               └─ Home reached (Conv: 99%)

Target: >= 50% complete signup

OTP Metrics:
├─ Delivery rate: >= 95%
├─ Success rate: >= 80%
└─ Avg time to verify: <= 2 min
```

---

## 🚨 Common Pitfalls to Avoid

❌ **No lo hagas:**
- No guardes tokens en localStorage (XSS risk)
  → Usa httpOnly cookies (más seguro)
- No hagas OTP sin rate limiting
  → Spam de bots intentando adivinar
- No uses SMS sin validar número
  → Usuarios pueden registrar números falsos
- No hagas profile obligatorio en signup
  → Deja que elija después (retention es mejor)

---

## 🧪 Testing Checklist (QA)

### Happy Path
- [ ] Signup completado en < 1 min
- [ ] Reabrir app → Home directo
- [ ] Logout → vuelve a auth

### Edge Cases
- [ ] Número ya registrado → "Ingresá directo"
- [ ] OTP expirado → "Reenviar"
- [ ] OTP incorrecto 5 veces → "Esperar 1 hora"
- [ ] Sin internet → error message
- [ ] Cambio de dispositivo → flujo normal

### Cross-browser
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari (iOS) ✓
- [ ] Edge ✓

---

## 📈 Success Metrics Post-Launch

```
Week 1:
└─ 1K signups mínimo
   └─ 30% retention day-1
   └─ 0 critical bugs

Month 1:
└─ 10K signups
   └─ 20% retention day-7
   └─ NPS >= 50
```

---

## 💬 Feedback Loop

- Agregar form "¿Qué te resultó confuso?" en auth
- Trackear abandono: qué pantalla causan más drops
- A/B test: SMS vs WhatsApp (si cambian de estrategia)
- User interviews: 10 camioneros reales, feedback

---

¡Buena suerte con la producción! 🚀
