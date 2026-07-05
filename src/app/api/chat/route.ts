import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { agentTools } from '../../../utils/tools';
import fs from 'fs';
import path from 'path';

// Read system prompt from artifact
const systemPromptPath = path.join(process.cwd(), '..', '..', '..', '.gemini', 'antigravity-ide', 'brain', '4fadef3a-b0b3-462d-b8d2-a08833149fb9', 'system_prompt.md');
let systemPrompt = "You are the GAT-B Guide AI Admission Advisor.";
try {
  systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
} catch(e) {
  // fallback if file doesn't exist
  systemPrompt = `You are the GAT-B Guide AI Admission Advisor, an elite, highly experienced, and empathetic admission counselling mentor for GAT-B (Graduate Aptitude Test - Biotechnology) aspirants.
  Your goal is to guide students through the complex postgraduate admission process for Biotechnology, Genetics, Agricultural Sciences, and related fields across Indian institutes.
  Use tools to fetch cutoffs. Explain with transparency citing historical cutoff, margin, eligibility, programme & location.`;
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-pro'),
    system: systemPrompt,
    messages,
    tools: agentTools,
    maxSteps: 5, // Allow multi-step tool calls
  });

  return result.toDataStreamResponse();
}
