
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-lessons.ts';
import '@/ai/flows/generate-personalized-explanations.ts';
import '@/ai/flows/student-question-flow.ts';
import '@/ai/flows/describe-image-flow.ts';
