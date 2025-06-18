import { test } from '@playwright/test';
import { Mistral } from '@mistralai/mistralai';

test.describe('Mistral API Diagnostic Tests', () => {
  test('check Mistral API connection and vision models', async () => {
    const apiKey = process.env.MISTRAL_API_KEY;
    
    console.log('\n=== MISTRAL API DIAGNOSTICS ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.error('❌ MISTRAL_API_KEY is not set!');
      console.log('\nTo fix this:');
      console.log('1. Create a .env.local file in the project root');
      console.log('2. Add: MISTRAL_API_KEY=your_actual_key_here');
      throw new Error('Missing API key');
    }

    const mistralClient = new Mistral({
      apiKey: apiKey,
    });

    try {
      // Try to list available models
      console.log('\n--- Checking available models ---');
      const models = await mistralClient.models.list();
      
      // Look for vision/OCR capable models
      if (models.data) {
        console.log('\nAll available models:');
        models.data.forEach(model => {
          console.log(`- ${model.id} (${model.object})`);
        });
        
        const visionModels = models.data.filter(model => 
          model.id.includes('pixtral') || 
          model.capabilities?.vision === true ||
          model.id.includes('vision')
        );
        
        console.log('\n🔍 Vision/OCR capable models:');
        if (visionModels.length > 0) {
          visionModels.forEach(model => {
            console.log(`\n✅ ${model.id}`);
            console.log(`   Type: ${model.object}`);
            console.log(`   Created: ${new Date(model.created * 1000).toISOString()}`);
            if (model.capabilities) {
              console.log(`   Capabilities:`, JSON.stringify(model.capabilities, null, 2));
            }
          });
        } else {
          console.log('❌ No vision models found. Looking for pixtral models...');
          const pixtralModels = models.data.filter(model => 
            model.id.toLowerCase().includes('pixtral')
          );
          if (pixtralModels.length > 0) {
            console.log('Found pixtral models:', pixtralModels.map(m => m.id));
          }
        }
      }
      
    } catch (error: any) {
      console.error('\n❌ Failed to list models:');
      console.error('Error:', error.message);
      console.error('Status:', error.status);
      
      if (error.status === 401) {
        console.error('\n⚠️  Authentication failed - check your API key!');
      }
    }

    // Test with pixtral-12b model specifically
    console.log('\n--- Testing pixtral-12b model ---');
    try {
      const chatResponse = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          { 
            role: 'user', 
            content: 'What model are you? Please respond with just your model name.'
          }
        ],
        maxTokens: 50,
        temperature: 0,
      });
      
      console.log('✅ pixtral-12b response:', chatResponse.choices?.[0]?.message?.content);
      console.log('   Model used:', chatResponse.model);
      
    } catch (error: any) {
      console.error('❌ pixtral-12b test failed:', error.message);
      console.error('   Status:', error.status);
      console.error('   Code:', error.code);
    }

    // Test vision capability with a simple image
    console.log('\n--- Testing vision capability ---');
    try {
      const visionResponse = await mistralClient.chat.complete({
        model: 'pixtral-12b',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Can you see images? Just say yes or no.'
              },
              {
                type: 'image_url',
                imageUrl: {
                  url: 'https://via.placeholder.com/100x100.png?text=TEST'
                }
              }
            ]
          }
        ],
        maxTokens: 10,
        temperature: 0,
      });
      
      console.log('✅ Vision test response:', visionResponse.choices?.[0]?.message?.content);
      
    } catch (error: any) {
      console.error('❌ Vision test failed:', error.message);
    }
  });
});