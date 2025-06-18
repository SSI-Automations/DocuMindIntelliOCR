# Task: Integrate Mistral OCR API into DocuMindIntelliOCR Application

## Overview
This task involves integrating the Mistral OCR API into the existing DocuMindIntelliOCR Next.js application to enable real document processing capabilities. Currently, the application has a mock processing flow - we need to replace this with actual OCR functionality using Mistral's OCR API.

## Current Application Analysis

### Existing Structure
- **Framework**: Next.js 15.2.4 with TypeScript
- **UI**: Tailwind CSS with Radix UI components
- **File Upload**: React Dropzone for PDF uploads (max 10MB)
- **Current Flow**: Mock processing with simulated progress
- **Components**: 
  - `FileUpload` - Handles file selection and upload UI
  - `ProcessingStatus` - Shows mock processing steps
  - `ExtractedContent` - Displays sample extracted text

### Current Limitations
- No actual file processing
- Mock data for extracted content
- No API integration
- No real OCR capabilities

## Mistral OCR API Reference

Based on the [Mistral OCR API documentation](https://docs.mistral.ai/api/#tag/ocr/operation/ocr_v1_ocr_post):

### Endpoint
- **URL**: `https://api.mistral.ai/v1/ocr`
- **Method**: POST
- **Authentication**: API Key required

### Request Format
```typescript
interface OCRRequest {
  // File upload (multipart/form-data)
  file: File; // The document file to process
  
  // Optional parameters
  language?: string; // Language hint for better OCR accuracy
  output_format?: 'text' | 'json'; // Response format preference
}
```

### Response Format
```typescript
interface OCRResponse {
  text: string; // Extracted text content
  confidence?: number; // OCR confidence score
  metadata?: {
    pages: number;
    language_detected?: string;
    processing_time?: number;
  };
}
```

## Implementation Plan

### Phase 1: Environment Setup and Configuration

#### 1.1 Environment Variables
Create/update `.env.local`:
```bash
MISTRAL_API_KEY=your_mistral_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

#### 1.2 API Configuration
Create `lib/mistral-config.ts`:
```typescript
export const MISTRAL_CONFIG = {
  apiKey: process.env.MISTRAL_API_KEY,
  baseUrl: 'https://api.mistral.ai/v1',
  endpoints: {
    ocr: '/ocr'
  },
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'),
  supportedFormats: ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
};
```

### Phase 2: API Integration Layer

#### 2.1 Create OCR Service
Create `lib/ocr-service.ts`:
```typescript
interface OCRResult {
  success: boolean;
  data?: {
    text: string;
    confidence?: number;
    metadata?: {
      pages: number;
      language_detected?: string;
      processing_time?: number;
    };
  };
  error?: string;
}

export class MistralOCRService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY!;
    this.baseUrl = 'https://api.mistral.ai/v1';
  }

  async processDocument(file: File, options?: {
    language?: string;
    output_format?: 'text' | 'json';
  }): Promise<OCRResult> {
    // Implementation details
  }

  private validateFile(file: File): boolean {
    // File validation logic
  }

  private createFormData(file: File, options?: any): FormData {
    // FormData creation logic
  }
}
```

#### 2.2 Create API Route Handler
Create `app/api/ocr/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { MistralOCRService } from '@/lib/ocr-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const ocrService = new MistralOCRService();
    const result = await ocrService.processDocument(file);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Phase 3: Frontend Integration

#### 3.1 Update File Upload Component
Modify `components/file-upload.tsx`:

**Key Changes:**
- Add support for multiple file formats (PDF, images)
- Implement real file upload to `/api/ocr`
- Add proper error handling
- Store file data for processing

```typescript
// Add to existing FileUpload component
const handleUpload = async () => {
  if (!file) return;

  setUploadStatus("uploading");
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    
    // Store result in localStorage or state management
    localStorage.setItem('ocrResult', JSON.stringify(result));
    
    setUploadStatus("success");
    router.push("/processing");
  } catch (error) {
    setUploadStatus("error");
    console.error('Upload error:', error);
  }
};
```

#### 3.2 Update Processing Status Component
Modify `components/processing-status.tsx`:

**Key Changes:**
- Remove mock processing steps
- Add real-time status updates
- Handle actual processing states

```typescript
// Update processing steps to reflect real OCR process
const processingSteps = [
  "Uploading document to Mistral OCR...",
  "Analyzing document structure...",
  "Extracting text content...",
  "Processing OCR results...",
  "Finalizing extraction...",
];
```

#### 3.3 Update Extracted Content Component
Modify `components/extracted-content.tsx`:

**Key Changes:**
- Remove sample data
- Load actual OCR results
- Add metadata display
- Improve text formatting

```typescript
// Replace sample data with real OCR results
useEffect(() => {
  const ocrResult = localStorage.getItem('ocrResult');
  if (ocrResult) {
    const parsed = JSON.parse(ocrResult);
    setExtractedText(parsed.text);
    setMetadata(parsed.metadata);
  }
}, []);
```

### Phase 4: Enhanced Features

#### 4.1 Add File Format Support
Update file upload to support:
- PDF documents
- JPEG/PNG images
- TIFF images
- Multi-page documents

#### 4.2 Add Processing Options
Create `components/processing-options.tsx`:
```typescript
interface ProcessingOptions {
  language?: string;
  output_format: 'text' | 'json';
  enhance_quality?: boolean;
}
```

#### 4.3 Add Results Management
Create `components/ocr-results.tsx`:
- Display confidence scores
- Show processing metadata
- Export functionality (TXT, JSON)
- Copy to clipboard
- Download results

#### 4.4 Error Handling and Validation
- File size validation
- Format validation
- API error handling
- Network error recovery
- User-friendly error messages

### Phase 5: UI/UX Improvements

#### 5.1 Progress Indicators
- Real-time upload progress
- Processing status updates
- Estimated completion time

#### 5.2 Results Display
- Formatted text output
- Confidence indicators
- Page-by-page results for multi-page docs
- Search and highlight functionality

#### 5.3 Responsive Design
- Mobile-optimized file upload
- Touch-friendly interfaces
- Progressive enhancement

### Phase 6: Testing and Optimization

#### 6.1 Testing Strategy
- Unit tests for OCR service
- Integration tests for API routes
- E2E tests for complete flow
- Error scenario testing

#### 6.2 Performance Optimization
- File compression before upload
- Chunked uploads for large files
- Caching strategies
- Loading states optimization

#### 6.3 Security Considerations
- API key protection
- File upload validation
- Rate limiting
- CORS configuration

## Implementation Steps

### Step 1: Setup (Day 1)
1. Add environment variables
2. Install any additional dependencies
3. Create basic OCR service structure
4. Set up API route handler

### Step 2: Core Integration (Day 2-3)
1. Implement MistralOCRService class
2. Update FileUpload component
3. Modify processing flow
4. Test basic OCR functionality

### Step 3: Enhanced Features (Day 4-5)
1. Add multiple file format support
2. Implement results display improvements
3. Add error handling
4. Create processing options

### Step 4: Polish and Testing (Day 6-7)
1. UI/UX improvements
2. Comprehensive testing
3. Performance optimization
4. Documentation updates

## Dependencies to Add

```json
{
  "dependencies": {
    "@types/multer": "^1.4.7",
    "multer": "^1.4.5-lts.1"
  }
}
```

## Environment Variables Required

```bash
# .env.local
MISTRAL_API_KEY=your_mistral_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_SUPPORTED_FORMATS=application/pdf,image/jpeg,image/png,image/tiff
```

## Success Criteria

1. ✅ Users can upload PDF and image files
2. ✅ Files are processed using Mistral OCR API
3. ✅ Extracted text is displayed accurately
4. ✅ Processing status shows real progress
5. ✅ Error handling works properly
6. ✅ Results can be searched and exported
7. ✅ Application is responsive and user-friendly

## Risk Mitigation

### API Limitations
- Implement retry logic for failed requests
- Add fallback error messages
- Monitor API usage and costs

### File Size/Format Issues
- Client-side validation before upload
- Server-side validation
- Clear error messages for unsupported formats

### Performance Concerns
- Implement file compression
- Add progress indicators
- Optimize for mobile devices

## Future Enhancements

1. **Batch Processing**: Multiple file uploads
2. **OCR Accuracy**: Post-processing text correction
3. **Document Analysis**: Structure detection, table extraction
4. **Integration**: Export to external services
5. **Analytics**: Usage tracking and insights

## Notes

- Ensure API key is kept secure and not exposed to client-side
- Consider implementing rate limiting to prevent API abuse
- Add proper logging for debugging and monitoring
- Test with various document types and qualities
- Consider adding user authentication for production use

---

**Priority**: High
**Estimated Effort**: 1-2 weeks
**Dependencies**: Mistral API access, API key setup
**Assignee**: Development Team

