import { test, expect } from '@playwright/test';
import { Mistral } from '@mistralai/mistralai';

// Test configuration
const TEST_TIMEOUT = 120000; // 2 minutes for OCR operations

test.describe('Mistral OCR Simple Test - Using Chat Completion', () => {
  test('simple PDF OCR using pixtral-12b chat model', async () => {
    test.setTimeout(TEST_TIMEOUT);

    const apiKey = process.env.MISTRAL_API_KEY;
    console.log('API Key check:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
    });

    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not set in environment');
    }

    const mistralClient = new Mistral({
      apiKey: apiKey,
    });

    // Use a test PDF
    const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    console.log('\n--- Testing OCR with PDF using Chat Completion ---');
    console.log('PDF URL:', pdfUrl);
    console.log('Model: pixtral-12b');

    try {
      console.log('Calling chat.complete with vision model...');
      const startTime = Date.now();
      
      // Use chat completion as per documentation
      const chatResponse = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What text is in this document? Please extract all the text you can see.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: pdfUrl
                }
              }
            ]
          }
        ],
        temperature: 0, // For consistent extraction
        maxTokens: 4096, // Allow for long documents
      });

      const endTime = Date.now();
      console.log(`Chat completion took ${endTime - startTime}ms`);

      console.log('\n=== RESPONSE ===');
      console.log('ID:', chatResponse.id);
      console.log('Model:', chatResponse.model);
      console.log('Usage:', chatResponse.usage);
      
      const extractedText = chatResponse.choices[0]?.message?.content;
      console.log('\nExtracted text length:', extractedText?.length || 0);
      console.log('Text preview:', extractedText?.substring(0, 300) + '...');
      
      // Basic validation
      expect(chatResponse).toBeDefined();
      expect(chatResponse.choices).toBeDefined();
      expect(chatResponse.choices.length).toBeGreaterThan(0);
      expect(extractedText).toBeDefined();
      expect(extractedText!.length).toBeGreaterThan(0);
      
      console.log('\n✅ Test passed!');

    } catch (error: any) {
      console.error('\n!!! ERROR !!!');
      console.error('Type:', error.constructor.name);
      console.error('Message:', error.message);
      console.error('Status:', error.status);
      console.error('Code:', error.code);
      
      if (error.response) {
        console.error('Response:', JSON.stringify(error.response, null, 2));
      }
      
      throw error;
    }
  });

  test('PDF OCR with specific extraction instructions', async () => {
    test.setTimeout(TEST_TIMEOUT);

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY is not set');
    }

    const mistralClient = new Mistral({
      apiKey: apiKey,
    });

    const pdfUrl = 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf';
    
    console.log('\n--- Testing structured extraction ---');

    try {
      const response = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract all text from this PDF document and format it nicely. If there are any headings, lists, or special formatting, preserve them.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: pdfUrl
                }
              }
            ]
          }
        ],
        temperature: 0,
      });

      const result = response.choices[0]?.message?.content;
      console.log('\nFormatted extraction result:');
      console.log(result?.substring(0, 500) + '...');
      
      expect(result).toBeDefined();
      console.log('\n✅ Structured extraction test passed!');

    } catch (error: any) {
      console.error('Structured extraction failed:', error);
      throw error;
    }
  });
});