import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, Job } from '../types.ts';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

// Match Result Schema
interface MatchResult {
  score: number;
  reason: string;
  isMatch: boolean;
}

/**
 * Analyzes the fit between a user's resume and a job description.
 */
export const analyzeJobFit = async (
  profile: UserProfile,
  job: Job
): Promise<MatchResult> => {
  if (!import.meta.env.VITE_API_KEY) {
    // Fallback for demo if no key provided
    return {
        score: 85,
        reason: "Demo Mode: API Key missing. Assuming good fit based on keywords.",
        isMatch: true
    };
  }

  try {
    const prompt = `
      Act as a strict hiring manager.
      Evaluate if the candidate's profile matches the job description.
      
      Candidate Profile:
      - Title: ${profile.title}
      - Skills: ${profile.skills.join(', ')}
      - Resume Summary: ${profile.resumeText.slice(0, 1000)}...
      
      Job Description:
      - Title: ${job.title}
      - Company: ${job.company}
      - Requirements: ${job.description}
      - Tags: ${job.tags.join(', ')}
      
      Return a JSON object with:
      - score: number (0-100)
      - reason: string (brief explanation of the score, max 2 sentences)
      - isMatch: boolean (true if score > 70)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            isMatch: { type: Type.BOOLEAN },
          },
          required: ['score', 'reason', 'isMatch'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as MatchResult;
  } catch (error) {
    console.error("Error analyzing job fit:", error);
    return {
      score: 0,
      reason: "Error analyzing fit. Skipping.",
      isMatch: false,
    };
  }
};

/**
 * Generates a tailored cover letter.
 */
export const generateCoverLetter = async (
  profile: UserProfile,
  job: Job
): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) return "Demo Mode: Cover letter would be generated here.";

  try {
    const prompt = `
      Write a professional, concise cover letter for this candidate applying to this job.
      
      Candidate: ${profile.name} (${profile.title})
      Resume Highlights: ${profile.resumeText}
      
      Job: ${job.title} at ${job.company}
      Description: ${job.description}
      
      Tone: Professional, enthusiastic, and confident. 
      Keep it under 200 words.
      Do not include placeholders like [Your Phone Number]. Use the resume info or generic placeholders if missing.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate cover letter.";
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return "Error generating cover letter due to API issue.";
  }
};

/**
 * Optimizes the user profile resume summary based on raw text input.
 */
export const optimizeProfileSummary = async (rawText: string): Promise<{summary: string, skills: string[]}> => {
     if (!import.meta.env.VITE_API_KEY) return {
         summary: "Demo Summary extracted from resume...",
         skills: ["Demo Skill 1", "Demo Skill 2"]
     };

    try {
        const prompt = `
          Analyze the following resume text. 
          1. Create a professional 2-sentence summary.
          2. Extract the top 5 hard skills.
          
          Resume Text:
          ${rawText.slice(0, 3000)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Error optimizing profile", e);
        return { summary: rawText.slice(0, 200), skills: [] };
    }
}
