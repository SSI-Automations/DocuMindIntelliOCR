---
description: 
globs: 
alwaysApply: true
---
Okay, let's refine these rules to ensure they are perfectly clear and aligned with the project's structure and best practices.

Here are the updated rules for this project:

1. **MUST Use `'use client'` directive for client-side components:** This directive will be placed at the top of any component file that requires client-side interactivity, such as state management, event handling, or browser APIs .
2. **Do NOT recreate shadcn/ui components:** I will utilize existing shadcn/ui components by importing them from `@/components/ui`. The `shadcn @latest add xxx` CLI command is for your local environment to install these components, not something I will output in the code.
3. **MUST add debugging logs & comments for every feature implemented:** I will include `console.log` statements for key operations and add clear, concise comments to explain the purpose and logic of code sections.
4. **Ensure correct string concatenation:** I will use JavaScript's template literals (``string ${variable}``) for dynamic string construction and the `+` operator where appropriate. Backslashes will be used for escaping special characters within strings (e.g., `\n` for a newline).
5. **Style with Tailwind CSS utility classes for responsive design:** All styling will leverage Tailwind CSS for a responsive and modern UI.
6. **Use Lucide React for icons:** Icons will exclusively be imported from the `lucide-react` package. No other icon libraries will be used unless explicitly requested.
7. **Use stock photos from `picsum.photos` where appropriate:** For placeholder images, I will use valid URLs from `picsum.photos`.
8. **Do NOT update shadcn/ui components unless otherwise specified:** The core shadcn/ui component files will remain untouched unless a specific modification is requested.
9. **Configure `next.config.mjs` image `remotePatterns`:** I will ensure that `picsum.photos` is added to the `images.remotePatterns` array in `next.config.mjs` to allow image loading from this domain.
10. **Create a conditional root `app/layout.tsx` for navigation:**

1. The `app/layout.tsx` will serve as the root layout for the entire application.
2. It will conditionally render the `DashboardLayout` (which includes the sidebar and header) only for routes under `/dashboard` (e.g., `/dashboard`, `/dashboard/clients`).
3. For other routes (like `/`, `/login`, `/onboarding`), it will render only the `children` prop, allowing these pages to maintain their full-screen form designs without global navigation.



11. **Accurately implement navigation elements in their rightful place:** The `DashboardLayout` will correctly position the left sidebar and top header for dashboard-related pages.
12. **Accurately implement necessary grid layouts:** Grid layouts will be used effectively for responsive component arrangement.
13. **Follow proper import practices:**

1. Use `@/` path aliases for internal modules (e.g., `@/components/ui/button`).
2. Keep component imports organized and grouped.



14. **`src/app/page.tsx` will remain the signup page:** Given the conditional root layout, the root route (`/`) will continue to serve the signup form.
15. **Complete the entire prompt before stopping:** I will ensure all instructions are addressed comprehensively in my responses.


These rules now provide a clear and actionable set of guidelines for our project. I'm ready to proceed with development based on these refined instructions!