const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAllModels() {
  const key = 'AIzaSyB6POXec2fHMh-Eqkd0_SQ8_p9IjyO0AOI';
  const genAI = new GoogleGenerativeAI(key);
  
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-pro',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemma-2-9b-it',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word.');
      console.log(`✅ SUCCESS: ${modelName} -> ${result.response.text()}`);
      return modelName; // Stop at first successful model
    } catch (error) {
      console.log(`❌ ERROR ${modelName}: ${error.message.split('\n')[0]}`);
    }
  }
}

testAllModels();
