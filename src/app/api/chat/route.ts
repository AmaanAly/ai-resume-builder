import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      // Build context string from the current resume data
      const resumeContext = `
      User Resume Profile Context:
      Name: ${context.name || 'Not provided'}
      Role/Title: ${context.experience?.[0]?.role || 'Not provided'}
      Summary: ${context.summary || 'Not provided'}
      Skills: ${context.skills || 'Not provided'}
      Experience: ${JSON.stringify(context.experience)}
      Education: ${JSON.stringify(context.education)}
      `;

      const prompt = `
      You are a highly skilled, friendly, and expert AI Resume Builder Assistant named "ResumeAI". 
      Your job is to help the user write their resume, suggest improvements, and answer their questions.
      
      CRITICAL INSTRUCTION FOR LANGUAGE:
      You MUST communicate in a friendly mix of English and written Hindi (Hinglish). 
      For example: "Haan bilkul! Main aapki help kar sakta hoon. Here are some great bullet points for your Software Engineer role..."
      
      CRITICAL INSTRUCTION FOR TONE:
      Be extremely encouraging, professional but casual (like a helpful friend).
      
      CRITICAL INSTRUCTION FOR FORMATTING:
      Keep your answers concise. Use bullet points for suggestions so the user can easily copy them. Do NOT use markdown code blocks (\`\`\`) unless writing actual programming code. Just use text.
      
      ${resumeContext}
      
      User Message: ${message}
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ reply: text });
    }

    // Mock Response if no API key
    await new Promise(r => setTimeout(r, 1000));
    
    // Simple logic for mock responses
    let reply = "Arey bhai, aapne abhi tak **GEMINI_API_KEY** configure nahi ki hai! 😅 Asli maza aur Hinglish chat ke liye `.env.local` mein API key daalo.\n\nLekin fikar mat karo, yeh raha ek sample text jo aap copy kar sakte ho:\n\n• Developed and maintained modern web applications using React and Next.js.\n• Collaborated with cross-functional teams to deliver projects on time.\n• Improved website performance by 40%.";
    
    if (message.toLowerCase().includes('summary')) {
      reply = "API key missing hai, warna main ekdum zabardast summary likh deta! 🚀\n\nAbhi ke liye yeh use kar lo:\n\nPassionate professional with fresh ideas and a strong desire to learn and grow. Eager to contribute to team success through hard work, attention to detail, and excellent organizational skills.";
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ reply: `Vercel Debug Error: ${errorMsg}` }, { status: 500 });
  }
}
