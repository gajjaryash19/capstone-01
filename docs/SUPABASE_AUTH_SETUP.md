# Supabase Auth Configuration Guide for Valora

This guide documents the setup, configuration, and verification of managed authentication in the Valora Customer Lifetime Value Intelligence Platform.

---

## 1. Environment Variables

Create or update your `frontend/.env` file with your project's public credentials:

```bash
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000

# Supabase Auth Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Requirement**: Never provide the Supabase `service_role` key to the frontend client. Only the public `anon` key (`VITE_SUPABASE_ANON_KEY`) should be exposed.

---

## 2. Supabase Project Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings** → **API**.
3. Copy **Project URL** into `VITE_SUPABASE_URL`.
4. Copy the public **`anon` `public`** API key into `VITE_SUPABASE_ANON_KEY`.

---

## 3. Authentication Settings & Redirect URLs

In your Supabase Dashboard, navigate to **Authentication** → **URL Configuration**:

### Site URL
- **Local Development**: `http://localhost:5173`
- **Production**: `https://your-production-domain.com`

### Redirect URLs (Allowed Callback URLs)
Add the following whitelist redirect patterns:
- `http://localhost:5173/login`
- `http://localhost:5173/reset-password`
- `http://localhost:5173/app/**`
- `https://your-production-domain.com/login`
- `https://your-production-domain.com/reset-password`
- `https://your-production-domain.com/app/**`

---

## 4. Email Auth Provider Configuration

In **Authentication** → **Providers** → **Email**:
1. Ensure **Enable Email provider** is turned **ON**.
2. **Confirm email**:
   - Turn **ON** for production environments to enforce email verification before initial login.
   - For rapid local development testing, you may optionally toggle this OFF.
3. **Secure email change**: Enabled by default.

---

## 5. Email Templates & Recovery Links

In **Authentication** → **Email Templates**:
- **Confirm signup**: Subject: *Confirm your Valora account*. Directs user back to `{{ .SiteURL }}/login`.
- **Reset password**: Subject: *Reset your Valora password*. Directs user to `{{ .SiteURL }}/reset-password`.

---

## 6. How to Test Authentication Locally

1. **Setup State**:
   - Without `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` defined, the authentication UI renders an unobtrusive warning notification: *"Supabase Setup Required"*, gracefully informing developers without runtime crashes.
2. **Sign Up**:
   - Navigate to `http://localhost:5173/signup`.
   - Submit your full name, email, and password (≥8 characters).
   - Once submitted, you will see the confirmation screen requesting email verification.
3. **Sign In**:
   - Navigate to `http://localhost:5173/login`.
   - Enter your email and password. Upon successful validation, Supabase Auth issues a JWT session stored securely via the browser client (`valora_auth_token`), and redirects you to the `/app` workspace.
4. **Protected Routes & Destination Preservation**:
   - If an unauthenticated user opens `http://localhost:5173/app/predictions`, they will be redirected to `http://localhost:5173/login`.
   - After signing in, they will be automatically redirected back to `http://localhost:5173/app/predictions`.
5. **Password Reset Flow**:
   - Navigate to `http://localhost:5173/forgot-password`.
   - Enter your email address to receive the password recovery email.
   - Click the link in the email to arrive at `http://localhost:5173/reset-password`, enter a new password, and proceed.
6. **Sign Out**:
   - In the top header bar of `/app/*`, click your profile avatar pill to open the user account dropdown.
   - Select **Sign Out** to revoke the Supabase session and return to `/login`.
