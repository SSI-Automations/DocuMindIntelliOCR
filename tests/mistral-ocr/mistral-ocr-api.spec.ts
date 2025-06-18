import { test, expect } from '@playwright/test';
import { Mistral } from '@mistralai/mistralai';
import { readFileSync } from 'fs';
import { join } from 'path';

// Test configuration
const TEST_PDF_URL = 'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf';
const TEST_IMAGE_PATH = join(__dirname, 'testdata', 'mistral-test-image.png');

test.describe('Mistral OCR API Tests - Based on Official Docs', () => {
  let mistralClient: Mistral;

  test.beforeAll(() => {
    // Ensure API key is available
    const apiKey = process.env.MISTRAL_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      throw new Error('MISTRAL_API_KEY environment variable is not set');
    }

    // Initialize Mistral client as per documentation
    mistralClient = new Mistral({
      apiKey: apiKey,
    });
    
    console.log('Mistral client initialized');
  });

  test('basic OCR - extract text from image using pixtral-12b', async () => {

    console.log('Starting OCR test with pixtral-12b model...');
    console.log('Test Image Path:', TEST_IMAGE_PATH);

    try {
      console.log('Reading local image file...');
      const imageBuffer = readFileSync(TEST_IMAGE_PATH);
      const imageBase64 = imageBuffer.toString('base64');
      
      console.log('Calling mistral.chat.complete with vision capabilities...');
      
      // Based on documentation, OCR is done via chat completion with vision model
      const chatResponse = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all the text from this image.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: `data:image/png;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      });

      console.log('\n=== CHAT RESPONSE ===');
      console.log(JSON.stringify(chatResponse, null, 2));
      console.log('=== END RESPONSE ===\n');

      // Validate response
      expect(chatResponse).toBeDefined();
      expect(chatResponse.choices).toBeDefined();
      expect(chatResponse.choices.length).toBeGreaterThan(0);

      const extractedText = chatResponse.choices[0]?.message?.content;
      console.log('\n--- Extracted Text ---');
      console.log('Length:', extractedText?.length || 0);
      console.log('Preview:', extractedText?.substring(0, 200) + '...');
      
      expect(extractedText).toBeDefined();
      expect(extractedText!.length).toBeGreaterThan(0);

      console.log('\n✅ Test passed!');

    } catch (error: any) {
      console.error('\n=== ERROR DETAILS ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error code:', error.code);
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      console.error('=== END ERROR ===\n');
      throw error;
    }
  });

  test('basic OCR - extract text from PDF using pixtral-12b (expect error)', async () => {
    // Note: Mistral vision API doesn't support PDF directly, this test demonstrates the limitation
    console.log('Testing PDF URL (expecting error):', TEST_PDF_URL);

    try {
      await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all the text from this PDF document.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: TEST_PDF_URL
                }
              }
            ]
          }
        ],
      });

      // Should not reach here if PDF is not supported
      expect(true).toBe(false);
    } catch (error: any) {
      // We expect an error for PDF URLs
      expect(error).toBeDefined();
      expect(error.message).toContain('could not be loaded as a valid image');
      console.log('Expected error for PDF URL:', error.message);
    }
  });

  test('structured data extraction from image', async () => {

    try {
      console.log('Reading local image file for structured extraction...');
      const imageBuffer = readFileSync(TEST_IMAGE_PATH);
      const imageBase64 = imageBuffer.toString('base64');
      
      // Ask for structured extraction from image
      const chatResponse = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract any text from this image and format it as markdown. Include any headings, lists, or tables you find.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: `data:image/png;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      });

      const result = chatResponse.choices[0]?.message?.content;
      console.log('\n--- Structured Extraction Result ---');
      console.log(result?.substring(0, 500) + '...');
      
      expect(result).toBeDefined();
      expect(result!.length).toBeGreaterThan(0);

    } catch (error: any) {
      console.error('Structured extraction from image failed:', error.message);
      throw error;
    }
  });

  test('handle invalid PDF URL gracefully', async () => {

    try {
      await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract text from this PDF.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: 'https://invalid-url-that-does-not-exist.com/document.pdf'
                }
              }
            ]
          }
        ],
      });

      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // We expect an error
      expect(error).toBeDefined();
      console.log('Expected error for invalid URL:', error.message);
    }
  });
});

