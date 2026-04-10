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
    const { data, jobDescription } = body;

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const prompt = jobDescription 
      ? `Analyze this resume against the following Job Description (JD). 
         
         RESUME DATA:
         ${JSON.stringify(data)}
         
         JOB DESCRIPTION:
         ${jobDescription}
         
         Return a JSON object with:
         1. matchScore (0-100)
         2. missingKeywords (array of strings)
         3. suggestions (array of strings on how to improve the resume for this specific JD)
         4. atsScore (0-100 general scoring)`
      : `Perform a deep ATS (Applicant Tracking System) analysis for this resume.
         
         RESUME DATA:
         ${JSON.stringify(data)}
         
         Return a JSON object with:
         1. atsScore (0-100)
         2. breakdown (object with scores for: formatting, impact, keywords, education)
         3. topTips (3-4 actionable improvement tips)
         4. analysis (A brief 2 sentence overall professional critique)`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert ATS (Applicant Tracking System) analyzer. Return strictly valid JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    const response = NextResponse.json(result);
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}
