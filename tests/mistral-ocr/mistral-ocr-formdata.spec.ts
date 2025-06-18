import { test, expect } from '@playwright/test';
import { Mistral } from '@mistralai/mistralai';
import { 
  validateEnvironment, 
  getTextStatistics,
  measureOCRPerformance,
  TEST_DOCUMENTS,
} from './test-helpers';

test.describe('Mistral OCR Advanced Tests - Using Chat API', () => {
  let mistralClient: Mistral;

  test.beforeAll(() => {
    // Validate environment
    validateEnvironment();

    // Initialize client as per documentation
    mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY!,
    });
  });

  test('PDF OCR with performance measurement', async () => {
    test.setTimeout(120000);

    const { result, duration } = await measureOCRPerformance(async () => {
      const response = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this PDF document. Return only the extracted text without any additional commentary.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: TEST_DOCUMENTS.pdf
                }
              }
            ]
          }
        ],
        temperature: 0,
        maxTokens: 8192,
      });

      return response.choices[0]?.message?.content || '';
    });

    // Get text statistics
    const stats = getTextStatistics(result);
    
    console.log('OCR Performance Results:');
    console.log(`- Processing time: ${duration.toFixed(2)}ms`);
    console.log(`- Word count: ${stats.wordCount}`);
    console.log(`- Character count: ${stats.length}`);
    console.log(`- Lines: ${stats.lineCount}`);

    expect(stats.hasContent).toBe(true);
    expect(duration).toBeLessThan(120000); // Should complete within 2 minutes
  });

  test('multi-page PDF processing', async () => {
    test.setTimeout(180000); // 3 minutes for multi-page

    try {
      console.log('Processing multi-page PDF...');
      
      const response = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'This is a multi-page PDF. Please extract text from ALL pages. For each page, indicate the page number before the content.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: TEST_DOCUMENTS.multiPage
                }
              }
            ]
          }
        ],
        temperature: 0,
      });

      const extractedText = response.choices[0]?.message?.content;
      console.log('Multi-page extraction result length:', extractedText?.length || 0);
      
      expect(extractedText).toBeDefined();
      expect(extractedText!.length).toBeGreaterThan(0);
      
      // Check if multiple pages were mentioned
      const pageMatches = extractedText!.match(/page\s+\d+/gi) || [];
      console.log(`Found ${pageMatches.length} page references`);
      
    } catch (error) {
      console.error('Multi-page processing error:', error);
      throw error;
    }
  });

  test('PDF with structured data extraction', async () => {
    test.setTimeout(120000);

    try {
      const response = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract structured information from this PDF. If you find any tables, lists, or special formatting, preserve the structure in your response.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: TEST_DOCUMENTS.pdf
                }
              }
            ]
          }
        ],
        temperature: 0,
      });

      const result = response.choices[0]?.message?.content;
      console.log('Structured extraction completed');
      console.log('Result preview:', result?.substring(0, 300) + '...');
      
      expect(result).toBeDefined();
      expect(result!.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Structured extraction error:', error);
      throw error;
    }
  });
});

// Test concurrent PDF processing
test.describe('Concurrent PDF Processing', () => {
  test('concurrent PDF OCR requests', async () => {
    test.setTimeout(180000); // 3 minutes for concurrent requests

    const mistralClient = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY!,
    });

    const pdfUrls = [
      TEST_DOCUMENTS.pdf,
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    ];
    
    console.log('Processing multiple PDFs concurrently...');
    const startTime = Date.now();
    
    const results = await Promise.all(
      pdfUrls.map(url => 
        mistralClient.chat.complete({
          model: 'pixtral-12b',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text from this PDF.'
                },
                {
                  type: 'image_url',
                  imageUrl: { url }
                }
              ]
            }
          ],
          temperature: 0,
        })
      )
    );
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Validate all results
    results.forEach((result, index) => {
      const text = result.choices[0]?.message?.content;
      console.log(`PDF ${index + 1}: ${text?.length || 0} characters extracted`);
      expect(text).toBeDefined();
      expect(text!.length).toBeGreaterThan(0);
    });

    console.log(`Concurrent processing of ${pdfUrls.length} PDFs took ${totalTime}ms`);
    expect(totalTime).toBeLessThan(180000); // Should complete within 3 minutes
  });
});