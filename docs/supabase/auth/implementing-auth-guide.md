# Supabase Authentication – Drop-in Guide for Next.js 15 (App Router)

This document shows how to copy the Health Coach AI login, signup, and logout flow into **any** Next.js App-Router project. All snippets are production-ready and use Supabase SSR + Server Actions.

---

## 1  Install Dependencies

```bash
pnpm add @supabase/ssr               # or npm / yarn
```

Add environment variables:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
```

---

## 2  Create a Reusable Server Client

`lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (all) =>
          all.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );
}
```

**Why?**
• Keeps access / refresh tokens in **HttpOnly Secure cookies** (no XSS).
• Seamlessly refreshes tokens on the server and exposes the same client in Server Components & Actions.

---

## 3  Automatic Session Refresh Middleware

`middleware.ts`

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware"; // exported by @supabase/ssr

export async function middleware(req: NextRequest) {
  return updateSession(req); // refresh tokens silently
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // protect everything except assets
  ],
};
```

---

## 4  Auth Server Actions

All three actions are `"use server"` functions. They run only on the server, so your keys remain secret.

### 4.1  Login

```ts
// app/auth/login/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = Object.fromEntries(formData) as {
    email: string; password: string;
  };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
```

### 4.2  Signup (+ optional profile & domain records)

```ts
// app/signup/actions.ts (simplified)
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signup(_: any, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1) Auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/auth/callback", // optional
    },
  });
  if (error) return { success: false, message: error.message };

  // 2) Upsert profile (optional)
  await supabase.from("profiles").upsert({ id: data.user!.id, role: "coach" });

  // 3) Insert any domain-specific rows (optional)
  await supabase.from("coach").insert({ user_id: data.user!.id });

  revalidatePath("/", "layout");
  return { success: true, message: "Account created!" };
}
```

### 4.3  Logout

```ts
// app/auth/logout/actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
```

---

## 5  Wire Up Minimal Pages / Forms

### Login Page (`app/auth/login/page.tsx`)

```tsx
<form action={login} className="space-y-4">
  <input name="email" type="email" placeholder="Email" required />
  <input name="password" type="password" placeholder="Password" required />
  <button type="submit">Log in</button>
</form>
```

### Signup Page (`app/signup/page.tsx`)

```tsx
<form action={signup} className="space-y-4">
  {/* additional fields… */}
  <button type="submit">Create account</button>
</form>
```

### Logout Button (anywhere)

```tsx
<form action={logout}>
  <button type="submit">Log out</button>
</form>
```

> Because these forms post directly to server actions, no client JS SDK is required. Supabase cookies are updated on the server, and your middleware keeps every request authenticated.

---

## 6  Protecting Server Components

```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

---

## 7  Quick Checklist

- [x] `.env` with URL + anon key  
- [x] `lib/supabase/server.ts` helper  
- [x] `middleware.ts` with `updateSession`  
- [x] `login`, `signup`, `logout` server actions  
- [x] Basic forms pointing to those actions  
- [x] (Optional) Upsert `profiles` & domain tables after signup  

Copy these files into any Next.js 15 project, update table names if needed, and you have a secure, SSR-friendly Supabase auth stack ready to go.
