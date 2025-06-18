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
- **TaskMaster AI** for project management

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
# Development (CRITICAL: Must fix config first - see below)
pnpm dev                 # Currently runs basic Next.js - NEEDS --turbo flag
pnpm build              # Production build
pnpm start              # Start production server
pnpm lint               # Run ESLint

# Testing
pnpm test               # Run Playwright E2E tests
pnpm test:ui            # Run tests with UI mode
pnpm test:headed        # Run tests in headed mode

# Task Management (NOT YET CONFIGURED)
# Need to add: "taskmaster": "task-master-ai" to package.json scripts
```

## CRITICAL: Configuration Issues That Must Be Fixed

### 1. Next.js Configuration (HIGH PRIORITY)
Current `next.config.mjs` is missing required Turbopack setup:

```javascript
// CURRENT (BROKEN)
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}

// REQUIRED (WORKING)
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  turbopack: {
    resolveAlias: {
      react: "react",
      "react-dom": "react-dom",
    },
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};
```

### 2. Package.json Updates Required
```json
{
  "name": "documind-intelliocr", // Currently "my-v0-project"
  "scripts": {
    "dev": "next dev --turbo", // Currently missing --turbo
    "taskmaster": "task-master-ai" // Missing entirely
  }
}
```

## Critical React 19 + Next.js 15 Compatibility Rules

### REQUIRED: Always use React 19 patterns
```javascript
// ❌ NEVER use (React 18 pattern)
import { useFormState } from "react-dom";

// ✅ ALWAYS use (React 19 pattern)
import { useActionState } from "react";
```

### Development must use Turbopack
After fixing config, always run `pnpm dev` (which should use `next dev --turbo`)

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

### ✅ Completed (Fully Functional)
- **Next.js 15 + React 19 Setup**: App Router, TypeScript, modern patterns
- **Complete shadcn/ui Library**: 55+ components with dark theme
- **Authentication System**: Supabase Auth with login/signup, Server Actions using `useActionState`
- **File Upload Interface**: React Dropzone with drag-and-drop, PDF validation
- **Route Protection**: Middleware with proper authentication flow
- **Testing Infrastructure**: Playwright E2E tests with auth flows
- **TaskMaster Integration**: Project management with 12 structured tasks

### 🔄 Partially Implemented
- **Document Processing Pipeline**: Mock processing flow, missing OCR API
- **Results Display**: ExtractedContent component with sample data
- **Supabase Setup**: Client/server configs exist, missing production environment

### ❌ Missing (Critical for Production)
- **Mistral OCR API Integration**: Core business functionality
- **Supabase Database Schema**: Tables and storage bucket
- **Export Functionality**: TXT/JSON download capabilities
- **Document Management**: History, search, bulk operations

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MISTRAL_API_KEY=your_mistral_api_key  # For OCR functionality
```

## TaskMaster AI Integration

### Task Management Commands
```bash
# Initialize TaskMaster (if not already done)
pnpm taskmaster init

# Get next task to work on
pnpm taskmaster next

# View all tasks
pnpm taskmaster get-tasks

# Update task status
pnpm taskmaster set-status <task-id> <status>

# Add new task
pnpm taskmaster add-task "Task description"
```

### Current Task Priority Order
1. **Fix Configuration Issues** (next.config.mjs, package.json)
2. **Setup Supabase Environment** (database schema, storage)
3. **Implement Mistral OCR API** (core functionality)
4. **Connect Processing Pipeline** (upload → OCR → results)
5. **Add Export Features** (TXT/JSON downloads)

## Key Development Guidelines

### Form Handling Pattern (React 19)
```typescript
"use client";
import { useActionState } from "react"; // NOT from "react-dom"

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
// app/actions/auth.ts
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

### IMMEDIATE (Must Fix Before Development)
1. **Fix next.config.mjs** - Add Turbopack configuration
2. **Update package.json** - Add --turbo flag and taskmaster script
3. **Fix project name** - Change from "my-v0-project" to "documind-intelliocr"

### HIGH PRIORITY (Core Functionality)
1. **Complete Supabase Integration** - Set up production environment and database schema
2. **Implement Mistral OCR** - Follow detailed guide in `ai-docs/add-mistral-ocr.md`
3. **Connect Processing Pipeline** - Link upload → OCR → results display
4. **Add Export Functionality** - TXT/JSON downloads with tracking

# Always add CLAUDE.md