# Quick Reference: React 19 + Next.js 15

## 🚨 Critical Rules

### 1. Always Use React 19 Patterns

```javascript
// ❌ OLD (React 18)
import { useFormState } from "react-dom";

// ✅ NEW (React 19)
import { useActionState } from "react";
```

### 2. Required next.config.js

```javascript
const nextConfig = {
  turbopack: {
    resolveAlias: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolveExtensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
};
```

### 3. Development Command

```bash
npm run dev  # Must use --turbo flag
```

## 🔧 Quick Fixes

### Form State Error

```javascript
// Replace this
const [state, formAction] = useFormState(action, initial);

// With this
const [state, formAction] = useActionState(action, initial);
```

### Turbopack Warning

Add to next.config.js:

```javascript
turbopack: {
  /* config above */
}
```

## 📦 Version Lock

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "next": "^15.1.0"
}
```

---

💡 **Need help?** Check `docs/REACT_NEXTJS_COMPATIBILITY_RULES.md`
