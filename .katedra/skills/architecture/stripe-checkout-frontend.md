# Stripe Checkout Frontend Architecture

**Corresponds to backend guide:** [stripe-billing.md](../../../katedra-server/.katedra/skills/architecture/stripe-billing.md)

---

## Overview

The checkout flow is a **two-step modal** driven by Zustand store, entered via a gear icon in the sidebar. Step 1 collects billing details; step 2 uses Stripe Elements to capture the card. Both steps are async and render inline errors.

**Key principle:** Never fetch inside `.jsx`. Flow: Component → Hook → Store → Service → API.

---

## Store: `suscripcionStore.js`

Manages checkout state and subscription lifecycle.

```javascript
{
  // Subscription state
  suscripcion: null,           // Current subscription (if PRO)
  uso: null,                   // Today's usage + plan
  
  // Checkout machine state
  paso: 'inactivo',            // 'inactivo' | 'datos' | 'tarjeta' | 'exito'
  clientSecret: null,          // For Stripe Elements
  publishableKey: null,        // For initializing Stripe
  suscripcionId: null,         // For confirming payment
  ciclo: 'mensual',            // Billing period toggle
  facturacion: null,           // Billing details (step 1)
  procesando: false,           // Loading state during async ops
  error: null,                 // Error message to display
  
  // Actions
  cargarUso(),                 // GET /suscripciones/me/uso
  cargarSuscripcion(),         // GET /suscripciones/me (PRO only)
  abrirCheckout(ciclo),        // paso: 'datos'
  cerrarCheckout(),            // paso: 'inactivo', clear errors
  volverADatos(),              // paso: 'datos' (from 'tarjeta')
  cambiarCiclo(ciclo),         // Clear clientSecret on change
  enviarDatosFacturacion(data),// POST /suscripciones → clientSecret + suscripcionId
  confirmarPago(),             // POST /suscripciones/{id}/confirmar
  fallarPago(mensaje),         // paso: 'tarjeta', display error
  cancelar(),                  // DELETE /suscripciones/me
  limpiarError()               // Clear error message
}
```

### State machine

```
inactivo ──abrirCheckout──► datos

datos ──submit inválido──────────────────► datos (errores locales)
      ──enviarDatosFacturacion 2xx─────► tarjeta [clientSecret + suscripcionId]
      ──enviarDatosFacturacion error──► datos (error servidor)

tarjeta ──volverADatos──────────────────► datos (conserva suscripcionId)
        ──fallarPago (declined/3DS)───► tarjeta (reintentable)
        ──confirmarPago ok ────────────► exito

exito ──cerrarCheckout──► inactivo + authStore.actualizarPlan('pro') + cargarUso()
```

**Back-button is safe:** Server reuses the `INCOMPLETA` subscription, so no duplicate in Stripe on re-submit.

---

## Services: `suscripcionService.js`

API wrapper. Each function catches `axios` errors and rethrows `Error` with backend message, so stores don't know about response shape.

```javascript
getMiUsoRequest()                              // GET /suscripciones/me/uso
getMiSuscripcionRequest()                      // GET /suscripciones/me
iniciarSuscripcionRequest({ ciclo, facturacion })  // POST /suscripciones
confirmarSuscripcionRequest(suscripcionId)     // POST /suscripciones/{id}/confirmar
cancelarSuscripcionRequest()                   // DELETE /suscripciones/me
```

All return parsed `data`, never raw axios response.

---

## Hooks: `useSuscripcion.js`

Binds the store and exposes derived state.

```javascript
useSuscripcion(cargarAlMontar = false)

// Returns
{
  // Store state (pass-through)
  suscripcion, uso, loading, error, paso, clientSecret, ...

  // Derived
  plan,                         // Current plan ('free' | 'pro' | null)
  esPro,                        // Boolean
  puedeUsarModeloPro,          // From uso.permiteModeloPro
  puedeGenerarDiapositivas,    // From uso.permiteDiapositivas
  puedeCargarArchivo,          // From uso.permiteCargaArchivo
  puedeCargarUrl,              // From uso.permiteCargaUrl
  
  generacionesUsadas,          // int, 0 if loading
  generacionesLimite,          // int
  generacionesRestantes,       // int, clamped ≥ 0
  exportacionesUsadas,         // int
  exportacionesLimite,         // int
}
```

**`cargarAlMontar={true}`** fetches usage on mount. Only `SidebarUserMenu` does this (used by all 5 panel pages), so the request fires once, not 5 times.

---

## Components

### `PlanBadge.jsx`
Renders plan pill (Gratis | Pro with sparkle icon). Returns `null` if plan is unknown (badge should never claim "Gratis" during a network blip for a Pro subscriber).

```jsx
<PlanBadge plan={uso?.plan} size="md" />
```

### `AjustesPopover.jsx`
Gear icon popover contents: plan + usage meters + upgrade CTA or "Manage plan" + logout.

Shows three distinct states:
- **Loading:** "…" (if `cargando && !uso`)
- **Failed:** "No disponible" (if `!uso && !cargando`)
- **Known:** badge + meters (if `uso`)

### `PlanModal.jsx`
Plan comparison modal. Entry point to checkout.

**For FREE users:**
- Shows comparison table (icons for checks/locks)
- Toggle: Mensual | Anual
- Price display + CTA "Mejorar a Pro"

**For PRO users:**
- Shows current plan
- Period end date
- Cancel button (with confirmation)

Opens on gear popover CTA or Landing pricing cards.

```jsx
<PlanModal abierto={modalOpen} onCerrar={close} onMejorar={ciclo => { checkout(ciclo) }} />
```

### `CheckoutModal.jsx`
Two-step checkout shell. Owns the step machine, error state, processing indicator.

**Step 1 (DatosFacturacionStep):** Form with fields:
- Nombre completo
- Email
- País, ciudad, dirección, código postal

Validates: no blanks, email format. On submit → `enviarDatosFacturacion()`.

**Step 2 (PagoTarjetaStep):** Stripe Elements. Mounted inside `<Elements>` provider with:
- `clientSecret` from step 1
- `appearance` (theme-aware styling, reads `--kt-*` vars)
- `fonts: [{ cssSrc: 'https://fonts.googleapis.com/...' }]`

On submit → `stripe.confirmPayment()`. On success → `confirmarPago()`. On error → `fallarPago(mensaje)`.

### `stripeAppearance.js`
Reads `--kt-*` CSS variables and builds Stripe Elements appearance object. Elements run in cross-origin iframe, so they can't read vars directly.

```javascript
construirAppearance(theme) → {
  theme: 'night' | 'flat',
  variables: { colorPrimary, colorBackground, colorText, ... },
  rules: { '.Input': { border, boxShadow, ... }, ... }
}
```

### `lib/stripe.js`
Module-scoped Stripe instance (singleton, loads once).

```javascript
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
```

**Why module scope?** `loadStripe()` inside component body re-initializes on every render → flicker. This approach initializes once.

---

## UI Integration

### Entry points
1. **Sidebar gear icon** (all 5 panel pages)
   - Popover shows usage + "Mejorar a Pro" button
   - Opens PlanModal

2. **Landing.jsx pricing section** (unauthenticated)
   - Price cards already exist
   - On click: if unauthenticated → `navigate('/register')`
   - If authenticated → open PlanModal

### Feature locks

**Generator.jsx:**
```jsx
// Model selector
<option disabled={!puedeUsarModeloPro}>Catedrático</option>

// Slides card
<CardDiapositivas disabled={!puedeGenerarDiapositivas} onUpgrade={() => setModalOpen(true)} />
```

**Dashboard.jsx:**
```jsx
// Temario source tabs
{!puedeCargarArchivo && <Badge>Pro</Badge>}  // PDF tab disabled
{!puedeCargarUrl && <Badge>Pro</Badge>}      // URL tab disabled
```

**Users.jsx:**
```jsx
// Replace role-based fake "Premium" badge with real plan
<PlanBadge plan={usuario.plan} size="sm" />
```

---

## Data Flow: How Plan Reaches Frontend

### At login (fast, for badge paint)
1. Backend: `JwtService.generateToken()` includes `plan` claim
2. Frontend: `buildSessionFromToken()` extracts plan → `localStorage.katedra_user`
3. Sidebar: `localStorage` plan paints badge immediately (1h TTL)

**Why immediate?** User sees "Pro" badge before the next async call.
**Why JWT is not trusted?** Token lives 1h; plan can change mid-session. But for **display**, it's fine.

### Authority check (async, for gates)
1. Frontend: `useSuscripcion(cargarAlMontar=true)` in SidebarUserMenu
2. Calls: `getMiUsoRequest()` → `GET /suscripciones/me/uso`
3. Server: Reads plan from `Usuario` table (true state)
4. Response: `{ plan: 'pro', permiteModeloPro: true, ... }`
5. Store updates `uso`, gates re-read from store
6. If badges/tokens disagree → store is the source of truth

### After checkout
1. Server syncs subscription from Stripe, updates `Usuario.plan`
2. Frontend confirms payment → calls `authStore.actualizarPlan('pro')`
3. Rewrites `localStorage.katedra_user`
4. Sidebar re-renders (no page reload needed)
5. Next async call to `/suscripciones/me/uso` confirms the change

---

## Error Handling

### Capability rejection (403)
```
Server rejects: "Modelo Catedrático no disponible en tu plan"
UI response: Toast or inline message + "Mejorar a Pro" button
```

### Quota exhaustion (429)
```
Server rejects: "Has alcanzado tu límite de generaciones por hoy"
UI response: Toast + "Mejorar a Pro" button in error state
```

### Checkout errors
- **Declined card:** Modal displays inline error "Tu tarjeta fue rechazada"
- **3DS:** Modal shows iframe with bank's challenge
- **Timeout:** Modal shows "No pudimos procesar tu pago"

All caught in `PagoTarjetaStep` and set via `fallarPago(msg)`.

---

## Testing Checklist

- [ ] FREE user opens gear → "Mejorar a Pro" button
- [ ] FREE user opens plan modal → comparison table with locks
- [ ] Toggle mensual/anual → price updates, no clientSecret leak
- [ ] Checkout step 1: validation works (blank name, bad email, etc.)
- [ ] Checkout step 1: submit → step 2, card input appears
- [ ] Checkout back-button: step 2 → step 1, data preserved
- [ ] Card `4242 4242 4242 4242` → success → sidebar badge = Pro
- [ ] Card `4000 0000 0000 0002` → declined error, can retry
- [ ] PRO user opens plan modal → shows "Gestionar mi plan" button
- [ ] PRO user opens plan modal → shows period end date
- [ ] PRO user can cancel → "Cancelar suscripción" button (with confirm)
- [ ] Dark/light theme toggle during checkout → appearance updates (theme captured once)
- [ ] Page reload after checkout → badge still Pro (localStorage)

---

## References

- [Stripe.js docs](https://stripe.com/docs/js)
- [Stripe Elements](https://stripe.com/docs/stripe-js/elements/payment-element)
- [Stripe test cards](https://stripe.com/docs/testing#cards)
- Backend guide: [stripe-billing.md](../../../katedra-server/.katedra/skills/architecture/stripe-billing.md)
