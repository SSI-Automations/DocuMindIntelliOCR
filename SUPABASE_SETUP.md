# Supabase SSR Authentication Setup

This document outlines the Supabase SSR authentication integration for DocuMindIntelliOCR.

## Overview

The application now uses Supabase SSR authentication with the following architecture:
- **Server Actions** for authentication operations (login, signup, logout)
- **Cookie-based sessions** for secure authentication state management
- **Middleware** for automatic token refresh and route protection
- **Client and Server utilities** for Supabase integration

## Files Created/Modified

### New Files
- `lib/supabase/client.ts` - Browser client for Client Components
- `lib/supabase/server.ts` - Server client for Server Components/Actions
- `app/actions/auth.ts` - Server Actions for authentication
- `middleware.ts` - Route protection and token refresh
- `app/error/page.tsx` - Authentication error handling page
- `.env.example` - Environment variables template

### Modified Files
- `components/auth-form.tsx` - Updated to use Server Actions
- `app/login/page.tsx` - Pass Server Actions to AuthForm
- `app/signup/page.tsx` - Pass Server Actions to AuthForm
- `components/header.tsx` - Show user state and logout option
- `package.json` - Added Supabase dependencies

## Dependencies Added

```json
{
  "@supabase/supabase-js": "^2.50.0",
  "@supabase/ssr": "^0.6.1"
}
```

## Environment Variables

The application requires the following environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication Flow

### 1. Login/Signup Process
- User submits form on `/login` or `/signup`
- Form data is sent to Server Actions (`login` or `signup`)
- Server Actions use Supabase client to authenticate
- On success: redirects to home page
- On error: redirects to `/error` page

### 2. Session Management
- Sessions are stored in HTTP-only cookies
- Middleware automatically refreshes tokens
- User state is available in both client and server components

### 3. Route Protection
- `/processing` route requires authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users on auth pages are redirected to home

## Usage Examples

### Server Component (getting user)
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>Hello {user?.email}</div>
}
```

### Client Component (auth state)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientComponent() {
  const [user, setUser] = useState(null)
  const supabase = createClient()
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])
  
  return <div>User: {user?.email}</div>
}
```

## Security Features

1. **Server-Side Validation**: All authentication logic runs on the server
2. **HTTP-Only Cookies**: Session tokens are not accessible via JavaScript
3. **Automatic Token Refresh**: Middleware handles token expiration
4. **PKCE Flow**: Enhanced security for authentication
5. **Route Protection**: Middleware guards protected routes

## Database Schema

The application uses the SSI Automations Centralized Data Hub project's auth schema with the `users` table supporting:
- Email/password authentication
- User profiles and preferences
- Session management

## Error Handling

- Authentication errors redirect to `/error` page
- Missing environment variables are handled gracefully
- Client-side errors are logged and handled appropriately

## Next Steps

1. **Configure Supabase Project**: Ensure the auth schema is properly set up
2. **Test Authentication**: Verify login/signup flows work correctly
3. **Add User Profiles**: Extend functionality with user-specific features
4. **Document Processing**: Integrate user authentication with document processing features

## Troubleshooting

### Build Errors
- Ensure environment variables are set correctly
- Check that Supabase project is accessible
- Verify all dependencies are installed

### Authentication Issues
- Check Supabase project settings
- Verify environment variables match project configuration
- Review middleware configuration for route protection

### Development
- Use `pnpm run dev` to start development server
- Authentication will work once environment variables are configured
- Check browser console and server logs for debugging information