import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    // Use Groq API via OpenAI SDK
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (apiKey) {
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      // Build context string from the current resume data
      const resumeContext = `
You are an expert bilingual (English and Roman Urdu / Hinglish) resume writer AI assistant. 
The user is building their resume. Here is their current data:
Name: ${context?.name || 'Not provided'}
Summary: ${context?.summary || 'Not provided'}
Experience: ${context?.experience?.map((e: any) => `${e.role} at ${e.company}`).join(', ') || 'Not provided'}
Education: ${context?.education?.map((e: any) => `${e.degree} at ${e.institution}`).join(', ') || 'Not provided'}
Skills: ${context?.skills || 'Not provided'}

Instructions: 
1. Be extremely helpful and conversational.
2. Reply in a natural, friendly mix of Hindi/Urdu written in English alphabet (Hinglish/Roman Urdu) and English terminology (like "Experience section", "Bullet points"). 
3. If the user asks you to write something for their resume (like a summary or bullet points), write it highly professionally in ENGLISH, and then explicitly encourage them to copy it.
4. Keep your responses concise. No lengthy greetings.`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: resumeContext },
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const text = completion.choices[0]?.message?.content || '';
      return NextResponse.json({ reply: text });
    }

    // Fallback if no API key is provided
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      reply: 'Bhai jaan, lagta hai aapne abhi tak `GROQ_API_KEY` apne `.env.local` ya Vercel environment variables mein set nahi ki hai! Usay set karein aur phir try karein. 🚀'
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ reply: `[API Error]: ${errorMsg}` }, { status: 500 });
  }
}
