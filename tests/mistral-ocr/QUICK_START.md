# Quick Start Guide for Mistral OCR Tests

## 1. Prerequisites

### Install Dependencies
```bash
pnpm install
```

### Set Up Environment Variables
1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Mistral API key:
   ```bash
   MISTRAL_API_KEY=your_actual_api_key_here
   ```

## 2. Running Tests

### Run Diagnostic Test First
```bash
# Check API connection and available models
pnpm test:ocr:diagnostic
```

### Run Simple OCR Test
```bash
# Test basic OCR functionality
pnpm test:ocr:simple
```

### Run All OCR Tests
```bash
pnpm test:ocr
```

### Run Specific Test File
```bash
# Minimal API test
pnpm test tests/mistral-ocr/mistral-ocr-api.spec.ts

# Advanced FormData tests
pnpm test tests/mistral-ocr/mistral-ocr-formdata.spec.ts
```

### Run with UI Mode (Interactive)
```bash
pnpm test:ui tests/mistral-ocr/
```

### Run in Headed Mode (See Browser)
```bash
pnpm test:headed tests/mistral-ocr/
```

### Using the Test Runner Script
```bash
# Normal mode
./tests/mistral-ocr/run-tests.sh

# UI mode
./tests/mistral-ocr/run-tests.sh --ui

# Headed mode
./tests/mistral-ocr/run-tests.sh --headed

# Debug mode
./tests/mistral-ocr/run-tests.sh --debug

# Run specific test
./tests/mistral-ocr/run-tests.sh mistral-ocr-api.spec.ts
```

## 3. Test Output

Tests will show:
- ✅ Successful chat completion responses
- 📝 Extracted text length and preview
- ⏱️ Processing time (30-120 seconds)
- 🔍 Vision model confirmation
- 📊 Token usage statistics

## 4. Common Issues

### API Key Not Found
```
Error: MISTRAL_API_KEY environment variable is not set
```
**Solution**: Add your API key to `.env.local`

### Timeout Errors
```
Test timeout of 120000ms exceeded
```
**Solution**: PDF processing takes 1-3 minutes. Ensure stable internet connection.

### Rate Limiting
```
Error: Too many requests
```
**Solution**: Wait a few minutes and try again.

## 5. Example Test Output

```
Running 7 tests using 1 worker

  ✓ [chromium] › mistral-ocr-api.spec.ts:25:7 › should successfully process a PDF document (5.2s)
    OCR Test Results:
    - Model: Focus
    - Pages processed: 1
    - First page text preview: The quick brown fox jumps over the lazy dog...

  ✓ [chromium] › mistral-ocr-api.spec.ts:65:7 › should successfully process an image (3.8s)
    Image OCR Results:
    - Extracted text length: 1542 characters

  7 passed (35.2s)
```

## 6. Next Steps

After verifying the tests pass:
1. Integrate the OCR service into your application
2. Use the same client initialization pattern
3. Implement proper error handling
4. Add loading states for OCR operations

## 7. Debugging

### Enable Debug Mode
```bash
PWDEBUG=1 pnpm test tests/mistral-ocr/mistral-ocr-api.spec.ts
```

### View Test Report
```bash
pnpm exec playwright show-report
```

### Check Test Artifacts
Look in `test-results/` for:
- Screenshots on failure
- Videos on failure
- JSON test results