---
trigger: model_decision
description: Prevent infinite update loops and ensure type-safe parent-child form state sync with React Hook Form in onboarding flows
globs: components/onboarding/*.tsx, components/onboarding/**/*.tsx
---

- **React Hook Form State Sync Patterns**

  - **Never put `watch()` values directly in `useEffect` dependency arrays.**
    - Instead, use the RHF subscription pattern:
      ```tsx
      useEffect(() => {
        const subscription = watch((values) => {
          updateData("stepKey", values);
        });
        return () => subscription.unsubscribe();
      }, [watch, updateData]);
      ```
    - This prevents infinite update loops caused by new object references on every render.
  - **Sanitize array fields before updating parent state.**
    - Filter out `undefined` from all array fields before calling `updateData`:
      ```tsx
      const sanitized = {
        ...values,
        someArray: Array.isArray(values.someArray)
          ? values.someArray.filter((v): v is string => typeof v === "string")
          : [],
      };
      updateData("stepKey", sanitized);
      ```
    - This ensures type safety and prevents subtle bugs with `(string | undefined)[]` vs `string[]`.
  - **Keep form state local to each step and only sync up when needed.**
    - Avoid prop drilling and unnecessary parent updates.
    - Use Zod schemas and strict TypeScript types for all form data.
  - **Add comments in code and document this pattern in project rules.**
    - Example comment:
      `// Use RHF subscription pattern to prevent infinite loops and ensure correct parent sync.`

- **Summary Table:**

| Problem                    | Prevention Pattern                               |
| -------------------------- | ------------------------------------------------ |
| Infinite update loop       | Use RHF subscription, not watched object in deps |
| Array type errors          | Sanitize arrays before updating parent state     |
| Prop drilling/duplication  | Keep form state local, only sync what’s needed   |
| TypeScript/validation bugs | Strict types, Zod schemas, fix type errors early |
| Hard-to-debug errors       | Add logs, use error boundaries                   |
| Team knowledge gaps        | Document patterns in code and rules              |

- **References:**
  - [React Hook Form - useWatch docs](https://react-hook-form.com/docs/usewatch)
  - [React Hook Form - FAQ: Why is useEffect running in an infinite loop?](https://react-hook-form.com/faqs#WhyisuseEffectrunninginaninfiniteloop)
