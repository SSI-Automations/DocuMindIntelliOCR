## **DocuMindIntelliOCR - Technical Documentation Plan**

### **1. Application Overview & Architecture**
- Next.js 15 App Router implementation
- TypeScript configuration and usage
- v0.dev integration and deployment pipeline
- Component-based architecture patterns

### **2. Component Hierarchy Diagram**
```mermaid
graph TD
    A[RootLayout] --> B[ThemeProvider]
    B --> C[Header]
    B --> D[Main Content]
    
    D --> E[Home Page]
    D --> F[Processing Page]
    D --> G[Auth Pages]
    
    E --> H[FileUpload]
    
    F --> I[ProcessingStatus]
    F --> J[ExtractedContent]
    
    G --> K[AuthForm - Login]
    G --> L[AuthForm - Signup]
    
    H --> M[react-dropzone]
    H --> N[Progress Component]
    
    I --> O[Loading Animation]
    I --> P[Step Tracker]
    
    J --> Q[Search Input]
    J --> R[Highlighted Text Display]
```

### **3. Data Flow Architecture**
```mermaid
sequenceDiagram
    participant U as User
    participant FU as FileUpload
    participant PS as ProcessingStatus
    participant EC as ExtractedContent
    participant R as Router
    
    U->>FU: Drop/Select PDF File
    FU->>FU: Validate file type/size
    FU->>U: Show file preview
    U->>FU: Click "Process PDF"
    FU->>PS: Navigate to /processing
    PS->>PS: Simulate processing steps
    PS->>EC: Trigger content display
    EC->>U: Show extracted text with search
```

### **4. User Journey Flow**
```mermaid
flowchart TD
    A[Landing Page] --> B{User Action}
    B -->|Upload PDF| C[File Selection]
    B -->|Login| D[Login Page]
    B -->|Sign Up| E[Signup Page]
    
    C --> F[File Validation]
    F -->|Valid| G[Processing Page]
    F -->|Invalid| H[Error State]
    
    G --> I[Status Animation]
    I --> J[Content Extraction]
    J --> K[Search & Highlight]
    
    D --> L[Authentication]
    E --> L
    L --> A
```

### **5. Technical Stack Deep Dive**
- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS + CSS-in-JS patterns
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React useState/useEffect patterns
- **Form Handling**: react-hook-form + Zod validation
- **File Handling**: react-dropzone integration
- **Routing**: Next.js App Router with dynamic navigation

### **6. Component Architecture Analysis**
- **Layout Components**: [`RootLayout`](app/layout.tsx), [`Header`](components/header.tsx)
- **Core Features**: [`FileUpload`](components/file-upload.tsx), [`ProcessingStatus`](components/processing-status.tsx), [`ExtractedContent`](components/extracted-content.tsx)
- **Authentication**: [`AuthForm`](components/auth-form.tsx) with dual login/signup modes
- **UI System**: 40+ Radix UI components in [`components/ui/`](components/ui/)

### **7. Implementation Patterns**
- Client-side component patterns with "use client" directives
- Custom hooks usage ([`use-mobile.tsx`](hooks/use-mobile.tsx), [`use-toast.ts`](hooks/use-toast.ts))
- Conditional rendering based on application state
- File processing simulation with timeout-based progress tracking
- Search functionality with regex highlighting

### **8. Configuration & Build Setup**
- Next.js configuration ([`next.config.mjs`](next.config.mjs))
- TypeScript configuration ([`tsconfig.json`](tsconfig.json))
- Tailwind CSS setup ([`tailwind.config.ts`](tailwind.config.ts))
- Component registry ([`components.json`](components.json))

Would you like me to proceed with creating the full technical documentation markdown file with these detailed sections and Mermaid diagrams?