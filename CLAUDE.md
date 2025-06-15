# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DocuMindIntelliOCR is an enterprise-grade OCR document processing application built for B2B software sales. Built with Next.js 15, React 19, TypeScript, and Supabase, targeting mid-to-large enterprises needing document processing solutions.

## Tech Stack & Architecture

### Core Technologies
- **Next.js 15.2.4** with App Router
- **React 19** with modern patterns  
- **TypeScript** for type safety
- **Supabase** (PostgreSQL, Auth, Storage)
- **pnpm** package manager

### UI Framework
- **shadcn/ui** complete component library (55+ components in `components/ui/`)
- **Tailwind CSS** for styling
- **Radix UI** primitives
- **next-themes** for dark mode (default theme)

### Key Architecture Patterns
- Server Components for data fetching
- Client Components with Server Actions
- File-based routing with App Router
- Component-driven development with atomic design

## Development Commands

```bash
# Development
pnpm dev                 # Start dev server with Turbo (required)
pnpm build              # Production build
pnpm start              # Start production server
pnpm lint               # Run ESLint

# Testing
pnpm test               # Run Playwright E2E tests
pnpm test:ui            # Run tests with UI mode
pnpm test:headed        # Run tests in headed mode

# Task Management
pnpm taskmaster         # Run Task Master AI project management
```

## Critical React 19 + Next.js 15 Compatibility Rules

### REQUIRED: Always use React 19 patterns
```javascript
// ❌ NEVER use (React 18 pattern)
import { useFormState } from "react-dom";

// ✅ ALWAYS use (React 19 pattern)
import { useActionState } from "react";
```

### REQUIRED: Turbopack configuration in next.config.js
```javascript
const nextConfig = {
  turbopack: {
    resolveAlias: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
```

### Development must use Turbopack
Always run `pnpm dev` (which uses `next dev --turbo`)

## Project Structure

```
app/                     # Next.js App Router
├── actions/auth.ts      # Server Actions for authentication
├── dashboard/           # Protected dashboard pages
├── login/signup/        # Authentication pages  
├── processing/          # Document processing workflow
└── layout.tsx           # Root layout with theme provider

components/              # React components
├── ui/                  # shadcn/ui component library (complete)
├── auth-form.tsx        # Authentication forms with useActionState
├── file-upload.tsx      # Drag-and-drop file upload
└── extracted-content.tsx # OCR results display

lib/                     # Utility libraries
├── supabase/           # Supabase client configurations
└── utils.ts            # Shared utilities with clsx/tailwind-merge

tests/                   # Playwright E2E tests
```

## Current Implementation Status

### ✅ Completed
- Complete shadcn/ui component library setup
- Authentication UI (login/signup forms)
- File upload interface with drag-and-drop
- Processing status display components
- Server Actions implementation
- Route protection middleware

### 🔄 In Progress  
- Supabase SSR integration (documented, needs env vars)
- File storage integration

### ⏳ Pending Implementation
- Mistral OCR API integration (fully documented in `ai-docs/add-mistral-ocr.md`)
- Document processing pipeline
- Export functionality (TXT/JSON)

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MISTRAL_API_KEY=your_mistral_api_key  # For OCR functionality
```

## Key Development Guidelines

### Form Handling Pattern
```typescript
"use client";
import { useActionState } from "react";

export function MyForm() {
  const [state, formAction] = useActionState(serverAction, initialState);
  
  return (
    <form action={formAction}>
      {/* form fields */}
    </form>
  );
}
```

### Server Actions Pattern  
```typescript
// app/actions.ts
"use server";

export async function myServerAction(prevState: any, formData: FormData) {
  try {
    // Process data
    return { message: "Success!" };
  } catch (error) {
    return { message: "Error occurred" };
  }
}
```

### Component Development
- Use existing shadcn/ui components from `components/ui/`
- Follow atomic design principles
- Maintain accessibility standards
- Use TypeScript for all components

## Testing Strategy

- **E2E Testing**: Playwright with auth flow tests
- **Component Testing**: Focus on critical user interactions
- **API Testing**: Server Actions integration tests

## Documentation

Comprehensive documentation available in:
- `ai-docs/` - AI-generated implementation guides
- `docs/` - Technical documentation  
- `.cursor/rules/` - Development guidelines and compatibility rules

## Business Context

Enterprise B2B product targeting:
- Insurance, legal, healthcare, accounting industries
- $10K-$25K license sales + customization services  
- 95% cost reduction vs enterprise solutions
- 99%+ OCR accuracy with Mistral AI

## Next Development Priorities

1. **Complete Supabase Integration** - Set up environment variables
2. **Implement Mistral OCR** - Follow `ai-docs/add-mistral-ocr.md` 
3. **File Storage Integration** - Connect uploads to Supabase Storage
4. **Results Management** - Display and export OCR results