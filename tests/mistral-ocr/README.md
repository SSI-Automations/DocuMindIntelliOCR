# Mistral OCR Tests - Using Chat Completion API

This directory contains Playwright tests for verifying Mistral OCR functionality using the official Chat Completion API with vision capabilities.

## Overview

Based on the [official Mistral OCR documentation](https://docs.mistral.ai/capabilities/OCR/basic_ocr/), OCR is performed using the `pixtral-12b` model via the Chat Completion API, not a dedicated OCR endpoint.

## Prerequisites

1. **Environment Variables**
   Add the following to your `.env.local` file:
   ```bash
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

2. **Dependencies**
   The tests require the Mistral AI TypeScript SDK:
   ```bash
   pnpm add -D @mistralai/mistralai
   ```

## Test Files

### `mistral-ocr-api.spec.ts`
Main test suite covering:
- Basic PDF OCR using `pixtral-12b` model
- Structured data extraction
- Error handling for invalid URLs
- Response validation

### `mistral-ocr-simple.spec.ts`
Simple tests including:
- PDF processing with chat completion
- Specific extraction instructions
- Performance measurement

### `mistral-ocr-formdata.spec.ts`
Advanced tests including:
- Multi-page PDF processing
- Concurrent request handling
- Structured data extraction
- Performance benchmarking

### `mistral-ocr-diagnostic.spec.ts`
Diagnostic tests for:
- API key validation
- Available models listing
- Vision capability testing

### `test-helpers.ts`
Utility functions and constants for:
- PDF document URLs (no images)
- Chat completion response validation
- Performance measurement
- Environment validation

## Running Tests

### Run all OCR tests
```bash
pnpm test tests/mistral-ocr/
```

### Run specific test file
```bash
pnpm test tests/mistral-ocr/mistral-ocr-api.spec.ts
```

### Run with UI mode
```bash
pnpm test:ui tests/mistral-ocr/
```

### Run in headed mode (see browser)
```bash
pnpm test:headed tests/mistral-ocr/
```

## Test Coverage

The tests verify:

1. **Basic Functionality**
   - PDF document processing via chat completion
   - Text extraction using `pixtral-12b` model
   - Vision capability validation

2. **Response Structure**
   - Chat completion response format
   - Message content with extracted text
   - Model and usage information

3. **Error Handling**
   - Invalid PDF URLs
   - Missing API keys
   - Authentication failures
   - Network errors

4. **Performance**
   - Processing time limits (2-3 minutes for complex PDFs)
   - Concurrent request handling
   - Token usage monitoring

5. **Advanced Features**
   - Multi-page PDF processing
   - Structured data extraction
   - Custom extraction instructions
   - Format preservation

## Expected Test Outcomes

### Successful Tests
- OCR requests should complete within 2 minutes for single page PDFs
- Response should contain extracted text in chat format
- Vision model should correctly identify and extract text
- Multi-page documents should be processed with page indicators

### Error Cases
- Invalid URLs should throw appropriate errors
- Missing API key should fail authentication
- Unsupported file formats should be rejected
- Rate limiting should be handled gracefully

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `MISTRAL_API_KEY` is set in `.env.local`
   - Restart the test runner after adding the key

2. **Timeout Errors**
   - Increase test timeout in test files
   - Check network connectivity
   - Verify API service status

3. **Rate Limiting**
   - Tests may fail if API rate limits are exceeded
   - Wait a few minutes before retrying
   - Consider adding delays between tests

4. **Document Not Found**
   - Test documents are hosted on GitHub
   - Ensure internet connectivity
   - Check if URLs are still valid

## Integration with Application

These tests verify the OCR functionality using the correct Mistral API approach. To integrate into the application:

1. Use `pixtral-12b` model with chat completion API
2. Format requests with `image_url` content type pointing to PDF URLs
3. Include clear extraction instructions in the text prompt
4. Handle chat completion responses (not OCR-specific responses)
5. Set appropriate timeouts (2-3 minutes for complex documents)

### Example Integration Code:
```typescript
const response = await mistralClient.chat.complete({
  model: 'pixtral-12b',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Extract all text from this PDF document.'
        },
        {
          type: 'image_url',
          imageUrl: { url: pdfUrl }
        }
      ]
    }
  ],
  temperature: 0,
  maxTokens: 8192,
});

const extractedText = response.choices[0]?.message?.content;
```

## Performance Benchmarks

Expected processing times with `pixtral-12b`:
- Single page PDF: 30-60 seconds
- Multi-page PDF: 60-180 seconds
- Simple image: 10-30 seconds
- Concurrent requests: 2-3x sequential time

## Future Enhancements

1. Add tests for base64 encoded PDF uploads
2. Test extraction with specific formatting instructions
3. Add tests for table and form extraction
4. Implement retry logic for timeout scenarios
5. Add tests for different PDF complexity levels