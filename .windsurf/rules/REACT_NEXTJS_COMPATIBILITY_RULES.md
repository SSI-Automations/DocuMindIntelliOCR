# React & Next.js Compatibility Rules

## Overview

This document outlines the mandatory compatibility rules and best practices for React and Next.js versions to prevent future breaking changes and ensure smooth development experience.

## Current Stable Configuration

### Recommended Versions

- **React**: `^19.0.0`
- **React DOM**: `^19.0.0`
- **Next.js**: `^15.1.0` or later
- **TypeScript**: `^5.0.0`
- **Node.js**: `>=18.17.0`

### Package.json Configuration

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5"
  },
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

## React 19 Migration Rules

### 1. Server Actions and Form State Management

#### ❌ DEPRECATED (React 18)

```javascript
import { useFormState } from "react-dom";

const [state, formAction] = useFormState(action, initialState);
```

#### ✅ REQUIRED (React 19)

```javascript
import { useActionState } from "react";

const [state, formAction] = useActionState(action, initialState);
```

### 2. Import Patterns

#### ❌ Avoid

```javascript
// Don't import from react-dom for hooks
import { useFormState } from "react-dom";
```

#### ✅ Required

```javascript
// Import all hooks from react
import { useActionState, useState, useEffect } from "react";
```

### 3. Form Action Handling

#### Standard Pattern

```javascript
import { useActionState, useTransition } from "react";

export function MyForm() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(serverAction, initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Next.js 15+ Configuration Rules

### 1. next.config.js/mjs Structure

#### Required Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential compatibility settings
  eslint: {
    ignoreDuringBuilds: true, // Only for rapid development
  },
  typescript: {
    ignoreBuildErrors: true, // Only for rapid development
  },

  // Turbopack configuration (REQUIRED for React 19)
  turbopack: {
    resolveAlias: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },

  // Webpack fallback for non-Turbopack builds
  webpack: (config, { dev, isServer }) => {
    // React 19 compatibility configurations
    if (dev && !isServer) {
      // Handle React Refresh Plugin issues
      const ReactRefreshPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === "ReactRefreshWebpackPlugin",
      );

      if (ReactRefreshPlugin) {
        ReactRefreshPlugin.options = {
          ...ReactRefreshPlugin.options,
          overlay: false,
        };
      }
    }

    // Module resolution improvements
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      react: "react",
      "react-dom": "react-dom",
    };

    return config;
  },
};

export default nextConfig;
```

### 2. Development Scripts

#### Required package.json scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## Version Compatibility Matrix

| Next.js Version | React Version | Status           | Notes                       |
| --------------- | ------------- | ---------------- | --------------------------- |
| 15.1.0+         | 19.0.0+       | ✅ Recommended   | Full React 19 support       |
| 15.0.0          | 19.0.0+       | ⚠️ Partial       | Some compatibility issues   |
| 14.x            | 19.0.0+       | ❌ Not supported | Breaking changes            |
| 14.x            | 18.x          | ✅ Legacy        | Use for older projects only |

## Turbopack Configuration Rules

### 1. Always Include Turbopack Config

When using Next.js 15+ with React 19, always include Turbopack configuration in next.config.js:

```javascript
turbopack: {
  resolveAlias: {
    react: "react",
    "react-dom": "react-dom",
  },
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
}
```

### 2. Development Command

Always use Turbopack in development:

```bash
npm run dev  # should execute: next dev --turbo
```

## Component Patterns

### 1. Server Components (App Router)

```typescript
// app/page.tsx
export default function Page() {
  return <div>Server Component</div>;
}
```

### 2. Client Components with Actions

```typescript
"use client";

import { useActionState } from "react";
import { myServerAction } from "./actions";

export function MyComponent() {
  const [state, formAction] = useActionState(myServerAction, { message: "" });

  return (
    <form action={formAction}>
      <input name="data" />
      <button type="submit">Submit</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### 3. Server Actions

```typescript
// app/actions.ts
"use server";

export async function myServerAction(prevState: any, formData: FormData) {
  try {
    const data = formData.get("data");
    // Process data
    return { message: "Success!" };
  } catch (error) {
    return { message: "Error occurred" };
  }
}
```

## Upgrade Checklist

### Before Upgrading

- [ ] Backup current working state
- [ ] Review React 19 breaking changes
- [ ] Update package.json with overrides
- [ ] Test in isolated environment

### During Upgrade

- [ ] Update package versions
- [ ] Replace `useFormState` with `useActionState`
- [ ] Add Turbopack configuration
- [ ] Update import statements
- [ ] Test all form submissions

### After Upgrade

- [ ] Run full test suite
- [ ] Check for console warnings
- [ ] Verify Turbopack is working
- [ ] Test production build
- [ ] Update documentation

## Troubleshooting

### Common Issues

#### 1. "useFormState has been renamed"

**Solution**: Replace with `useActionState` from React

#### 2. "Webpack configured while Turbopack is not"

**Solution**: Add turbopack configuration to next.config.js

#### 3. Module resolution errors

**Solution**: Ensure resolveAlias is properly configured

#### 4. Type errors with React 19

**Solution**: Verify @types/react version matches React version

### Emergency Rollback

If critical issues occur:

```bash
npm install react@^18.2.0 react-dom@^18.2.0 next@^14.2.0
npm install --save-dev @types/react@^18 @types/react-dom@^18
```

## Monitoring and Maintenance

### Weekly Checks

- [ ] Review Next.js release notes
- [ ] Check React release announcements
- [ ] Monitor dependency vulnerabilities
- [ ] Test critical user flows

### Monthly Reviews

- [ ] Evaluate new Next.js features
- [ ] Review React ecosystem updates
- [ ] Update compatibility matrix
- [ ] Review and update this document

## Team Guidelines

### Code Review Requirements

- [ ] Verify React 19 patterns are used
- [ ] Check Turbopack compatibility
- [ ] Ensure proper import statements
- [ ] Test form functionality

### Pull Request Checklist

- [ ] No `useFormState` usage
- [ ] All hooks imported from React
- [ ] Turbopack configuration present
- [ ] Tests pass with new versions

---

**Last Updated**: 2025-01-15  
**Next Review**: 2025-02-15  
**Maintained By**: Development Team
