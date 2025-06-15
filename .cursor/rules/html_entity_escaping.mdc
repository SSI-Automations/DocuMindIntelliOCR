---
description: 
globs: 
alwaysApply: false
---
# HTML Entity Escaping in JSX

This rule ensures that special HTML characters, particularly apostrophes, are properly escaped within JSX content to avoid linting errors and ensure consistent rendering.

## **Rule Details**

- **ALWAYS escape special HTML characters** when they appear directly within JSX text content.
- The primary entity to escape is the apostrophe (`'`), using `&apos;`.
- Other common entities include `&quot;` (double quote), `&lt;` (less than sign `<`), `&gt;` (greater than sign `>`), and `&amp;` (ampersand `&`).

## **Examples**

### **Apostrophes (`'`)**

```jsx
// ✅ DO: Use &apos; for apostrophes in text content
<p>The page you are looking for doesn&apos;t exist.</p>
<p>You&apos;re Offline</p>

// ❌ DON'T: Use unescaped apostrophes in text content
<p>The page you are looking for doesn't exist.</p>
<p>You're Offline</p>
```

### **Other HTML Entities**

```jsx
// ✅ DO: Escape other special characters as needed
<p>Use &lt;div&gt; tags for containers.</p>
<p>This is a &quot;quote&quot;.</p>
<p>A &amp; B</p>

// ❌ DON'T: Leave special characters unescaped
<p>Use <div> tags for containers.</p>
<p>This is a "quote".</p>
<p>A & B</p>
```

## **Why this rule?**

- Prevents `react/no-unescaped-entities` ESLint errors.
- Ensures consistent and correct rendering across different browsers.
- Improves JSX parsing stability.
- Contributes to valid HTML output for better SEO and accessibility.
