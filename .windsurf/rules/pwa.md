---
trigger: model_decision
description:
globs:
---

---

description: Rules for implementing Progressive Web App (PWA) features in Next.js App Router
globs: app/**/\*.{ts,tsx,js,jsx}, public/sw.js, public/manifest.json, app/manifest.ts, components/**/_service-worker_.{ts,tsx}
alwaysApply: true

---

# PWA Implementation Rules for Next.js App Router

## **Core PWA Architecture**

- **DO NOT use third-party PWA plugins** like `next-pwa` or `@ducanh2912/next-pwa`

  - These often have compatibility issues with Next.js App Router
  - They can cause build errors with error pages and Server Components
  - Manual implementation gives better control and compatibility

- **Use Next.js built-in features**
  - Use `app/manifest.ts` for web app manifest (NOT `public/manifest.json`)
  - Leverage App Router's error handling (`error.tsx`, `global-error.tsx`, `not-found.tsx`)
  - Use client components for any interactive PWA features

## **Service Worker Implementation**

- **Service Worker Location and Registration**

  ```javascript
  // ✅ DO: Place service worker in public/sw.js
  // ✅ DO: Register only in production
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }

  // ❌ DON'T: Register in development or without feature detection
  navigator.serviceWorker.register("/sw.js"); // Wrong!
  ```

- **Service Worker Caching Strategy**

  ```javascript
  // ✅ DO: Skip caching for Next.js internals and API routes
  if (!event.request.url.includes('/_next/') &&
      !event.request.url.includes('/api/')) {
    cache.put(event.request, responseToCache);
  }

  // ✅ DO: Implement proper offline fallback
  .catch(() => {
    if (event.request.destination === 'document') {
      return caches.match('/offline');
    }
  })
  ```

- **Service Worker Updates**

  ```javascript
  // ✅ DO: Use skipWaiting and claim for immediate activation
  self.addEventListener("install", (event) => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    self.clients.claim();
  });
  ```

## **Manifest Configuration**

- **Use TypeScript Manifest in App Router**

  ```typescript
  // ✅ DO: app/manifest.ts
  import type { MetadataRoute } from "next";

  export default function manifest(): MetadataRoute.Manifest {
    return {
      name: "Health Coach AI",
      short_name: "Health Coach AI",
      start_url: "/",
      display: "standalone",
      theme_color: "#14b8a6",
      background_color: "#f8fafc",
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable", // NOT 'any maskable'
        },
      ],
    };
  }

  // ❌ DON'T: Use public/manifest.json with App Router
  ```

## **Component Architecture**

- **Service Worker Registration Component**

  ```typescript
  // ✅ DO: Create a client component for SW registration
  "use client";

  export function ServiceWorkerRegistration() {
    useEffect(() => {
      if (
        "serviceWorker" in navigator &&
        process.env.NODE_ENV === "production"
      ) {
        // Registration logic
      }
    }, []);

    return null;
  }
  ```

- **Offline Page Requirements**

  ```typescript
  // ✅ DO: Make offline page a client component if it has interactivity
  'use client';

  export default function OfflinePage() {
    return (
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    );
  }

  // ❌ DON'T: Server component with event handlers
  ```

## **Error Handling Integration**

- **PWA-Compatible Error Pages**

  - Always use client components for error boundaries
  - Ensure error pages work offline
  - Don't rely on external resources in error pages

  ```typescript
  // ✅ DO: app/error.tsx
  "use client";

  export default function Error({ error, reset }) {
    // Error handling logic
  }
  ```

## **Build Configuration**

- **Next.js Config for PWA**

  ```javascript
  // ✅ DO: Keep next.config.mjs simple
  const nextConfig = {
    // Standard Next.js config
  };
  export default nextConfig;

  // ❌ DON'T: Wrap with PWA plugins
  export default withPWA(nextConfig); // Avoid!
  ```

## **Git Ignore Rules**

- **Always exclude generated SW files**
  ```gitignore
  # PWA files
  public/workbox-*.js
  public/sw.js.map
  public/workbox-*.js.map
  ```

## **Testing PWA Features**

- **Development Testing**

  - Service workers are disabled in development by default
  - Test PWA features with production builds: `npm run build && npm start`
  - Use Chrome DevTools > Application tab to debug

- **Build Verification**
  - Always run `npm run build` after PWA changes
  - Check for prerendering errors
  - Verify manifest is accessible at `/manifest.webmanifest`

## **Common Pitfalls to Avoid**

1. **Mixing Server and Client Components**

   - Don't use `export const dynamic` in client components
   - Don't pass event handlers to Server Components

2. **Incorrect Manifest Purpose Values**

   - Use `'maskable'` not `'any maskable'`
   - Valid values: `'any'`, `'maskable'`, `'monochrome'`

3. **Service Worker Scope Issues**

   - Always register from root scope `'/'`
   - Don't use nested scopes unless necessary

4. **Caching Strategy Mistakes**
   - Don't cache Next.js internal routes (`/_next/`)
   - Don't cache API routes (`/api/`)
   - Always provide offline fallbacks

## **PWA Feature Checklist**

When implementing PWA features, ensure:

- [ ] Service worker in `public/sw.js`
- [ ] Registration component in client component
- [ ] Manifest file as `app/manifest.ts`
- [ ] Offline page as client component
- [ ] Error pages are client components
- [ ] Git ignores generated SW files
- [ ] Build passes without errors
- [ ] PWA works in production build

## **References**

- [manifest.ts implementation](mdc:app/manifest.ts)
- [Service Worker](mdc:public/sw.js)
- [SW Registration Component](mdc:components/service-worker-registration.tsx)
- [Offline Page](mdc:app/offline/page.tsx)
- Next.js App Router PWA docs: https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps
