---
trigger: model_decision
description:
globs:
---

# Supabase Client Usage Rule

**MUST use the `@supabase/ssr` helper clients for all interactions.** This project is configured to use Server-Side Rendering (SSR) with Next.js, and our Supabase setup in `lib/supabase/` is specifically designed to handle authentication and session management correctly across different rendering environments.

## Core Principle

- **NEVER import from `@supabase/supabase-js` directly.**
- **NEVER install `@supabase/supabase-js`.** The `@supabase/ssr` package already includes it as a dependency.
- **ALWAYS use one of the three pre-configured clients from `lib/supabase/`**.

---

## Client Types & Usage

### 1. Client Components

For any component marked with `'use client'`, you **MUST** use the client from `lib/supabase/client.ts`. This client is designed for use in the browser.

```typescript
// ✅ DO: Use the browser client in Client Components
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const supabase = createClient();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("your_table").select();
      setData(data);
    };
    fetchData();
  }, []);

  // ...
}
```

### 2. Server Components, Server Actions, Route Handlers

For any server-side code (Server Components, Server Actions, API Routes), you **MUST** use the client from `lib/supabase/server.ts`. This client has access to the request's cookies and can securely handle user sessions on the server.

```typescript
// ✅ DO: Use the server client in Server Actions or Server Components
import { createClient } from "@/lib/supabase/server";

export async function myServerAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Handle unauthenticated user
    return;
  }

  // ... perform server-side logic
}
```

### 3. Middleware

Our middleware in `src/middleware.ts` already uses the correct Supabase client to refresh user sessions on every request. This logic is critical for maintaining a stable login state and should not be modified without careful consideration. It relies on the helper found in `lib/supabase/middleware.ts`.

---

## Anti-Patterns

This section shows what you **MUST NOT** do.

```typescript
// ❌ DON'T: Install or import the standard JS client directly
// This will break session management in an SSR environment.
import { createClient } from "@supabase/supabase-js";

// ❌ DON'T: Attempt to create a new Supabase client instance in components
// Always use the helpers.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```
