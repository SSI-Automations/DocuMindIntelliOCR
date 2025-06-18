import { readFileSync } from 'fs';
import { join } from 'path';

// Test document URLs (PDFs only)
export const TEST_DOCUMENTS = {
  pdf: 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf',
  multiPage: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  sample: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
};

// Vision model for OCR
export const VISION_MODEL = 'pixtral-12b';

// Helper to create FormData for local file upload
export function createFormDataFromFile(filePath: string): FormData {
  const fileContent = readFileSync(filePath);
  const formData = new FormData();
  const blob = new Blob([fileContent], { type: 'application/pdf' });
  formData.append('file', blob, 'test-document.pdf');
  return formData;
}

// Helper to validate chat completion response for OCR
export function validateChatOCRResponse(response: any): void {
  expect(response).toBeDefined();
  expect(response).toHaveProperty('choices');
  expect(response).toHaveProperty('model');
  expect(response).toHaveProperty('usage');
  
  expect(Array.isArray(response.choices)).toBe(true);
  expect(response.choices.length).toBeGreaterThan(0);
  
  const message = response.choices[0]?.message;
  expect(message).toBeDefined();
  expect(message.content).toBeDefined();
  expect(typeof message.content).toBe('string');
  expect(message.content.length).toBeGreaterThan(0);
}

// Helper to extract text statistics
export function getTextStatistics(text: string) {
  return {
    length: text.length,
    wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
    lineCount: text.split('\n').length,
    hasContent: text.trim().length > 0,
  };
}

// Helper to measure OCR performance
export async function measureOCRPerformance<T>(
  operation: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  const result = await operation();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  return { result, duration };
}

// Mock response for testing when API is unavailable
export const mockChatOCRResponse = {
  id: 'test-completion-id',
  object: 'chat.completion',
  created: Date.now(),
  model: 'pixtral-12b',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'This is a test document with sample text for OCR testing. The document contains standard business information including headers, body text, and contact details.',
      },
      finishReason: 'stop',
    },
  ],
  usage: {
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
  },
};

// Environment variable validation
export function validateEnvironment(): void {
  const requiredEnvVars = ['MISTRAL_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please add them to your .env.local file.'
    );
  }
}

// Error matchers
export const ERROR_PATTERNS = {
  invalidApiKey: /invalid.*api.*key/i,
  unsupportedFormat: /unsupported.*format/i,
  networkError: /network.*error/i,
  timeout: /timeout/i,
  notFound: /not.*found/i,
};