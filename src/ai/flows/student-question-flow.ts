
'use server';
/**
 * @fileOverview Provides an AI tutor to answer student questions.
 *
 * - answerStudentQuestion - A function that handles student questions.
 * - StudentQuestionInput - The input type for the answerStudentQuestion function.
 * - StudentQuestionOutput - The return type for the answerStudentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentQuestionInputSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters long.").describe('The specific question the student is asking.'),
  topicContext: z.string().optional().describe('Optional: The broader topic or context for the question (e.g., "photosynthesis", "solving quadratic equations").'),
  studentProfile: z.string().optional().describe('Optional: Brief information about the student (e.g., "10th grader, visual learner", "struggling with basic algebra concepts"). Helps tailor the answer.'),
});
export type StudentQuestionInput = z.infer<typeof StudentQuestionInputSchema>;

const StudentQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI tutor\'s answer to the student\'s question.'),
});
export type StudentQuestionOutput = z.infer<typeof StudentQuestionOutputSchema>;

export async function answerStudentQuestion(input: StudentQuestionInput): Promise<StudentQuestionOutput> {
  return studentQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentQuestionPrompt',
  input: {schema: StudentQuestionInputSchema},
  output: {schema: StudentQuestionOutputSchema},
  prompt: `You are a friendly and knowledgeable AI Tutor. A student has a question.
Student's Question: "{{{question}}}"

{{#if topicContext}}
The question is related to the topic/context of: "{{{topicContext}}}"
{{/if}}

{{#if studentProfile}}
Here's a little about the student: "{{{studentProfile}}}"
{{/if}}

Please provide a clear, helpful, and encouraging answer to the student's question.
If the question is unclear, ask for clarification.
If the question is complex, break down the answer into understandable parts.
Use examples if they help explain the concept.
Tailor your language to be appropriate for a student seeking help.
`,
});

const studentQuestionFlow = ai.defineFlow(
  {
    name: 'studentQuestionFlow',
    inputSchema: StudentQuestionInputSchema,
    outputSchema: StudentQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
