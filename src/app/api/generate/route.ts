import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, context } = body;

    // Use Groq API via OpenAI SDK
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (apiKey) {
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      let prompt = '';
      if (section === 'summary') {
        prompt = `Write a compelling, concise professional summary (3-4 sentences) for a resume. 
Details: ${context}
Make it powerful, results-oriented, and in first-person without using "I". 
Return ONLY the summary text, no extra commentary.`;
      } else if (section.startsWith('bullets')) {
        prompt = `Transform this job experience into 3-4 powerful resume bullet points.
Details: ${context}
Requirements:
- Start each bullet with a strong action verb
- Include quantifiable achievements where possible (use reasonable estimates if none given)
- Be specific and impactful
- Each bullet on a new line starting with • 
Return ONLY the bullet points, nothing else.`;
      } else if (section === 'skills') {
        prompt = `Based on this profile, suggest 10-12 relevant technical and soft skills for a resume.
Details: ${context}
Return ONLY a comma-separated list of skills, nothing else.`;
      }

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });

      const text = completion.choices[0]?.message?.content || '';
      const response = NextResponse.json({ result: text });
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return response;
    }

    // Mock AI responses (no API key required)
    const mocks: Record<string, string> = {
      summary: `Results-driven professional with a proven track record of delivering high-impact solutions in fast-paced environments. Skilled at leveraging data-driven insights to optimize processes and drive measurable business growth. Adept at cross-functional collaboration, consistently exceeding targets and building strong stakeholder relationships. Passionate about innovation and continuously seeking opportunities to add strategic value.`,
      bullets: `• Spearheaded development of a scalable microservices architecture, reducing system latency by 40% and improving user experience for 200K+ monthly active users\n• Led cross-functional team of 8 engineers to deliver critical product features 2 weeks ahead of schedule, resulting in $500K additional revenue\n• Optimized CI/CD pipeline processes, cutting deployment time by 65% and enabling 3x faster release cycles\n• Mentored 4 junior developers, fostering a culture of code quality and best practices that reduced bug rate by 30%`,
      skills: `JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, GraphQL, Agile/Scrum, Team Leadership, Problem Solving`,
    };

    await new Promise(r => setTimeout(r, 1200)); // Simulate API delay
    return NextResponse.json({ result: mocks[section] || mocks.summary });
  } catch (error) {
    console.error('Generation error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ result: `[API Error]: ${errorMsg}` }, { status: 500 });
  }
}
