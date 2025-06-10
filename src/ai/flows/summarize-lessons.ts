// Summarize lessons to highlight key details students might have missed.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLessonsInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The content of the lesson to be summarized.'),
  context: z
    .string()
    .describe(
      'The current context of the class, including recent topics and student understanding.'
    ),
});
export type SummarizeLessonsInput = z.infer<typeof SummarizeLessonsInputSchema>;

const SummarizeLessonsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the lesson, highlighting key details that might have been overlooked or are particularly important.'
    ),
});
export type SummarizeLessonsOutput = z.infer<typeof SummarizeLessonsOutputSchema>;

export async function summarizeLessons(input: SummarizeLessonsInput): Promise<SummarizeLessonsOutput> {
  return summarizeLessonsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLessonsPrompt',
  input: {schema: SummarizeLessonsInputSchema},
  output: {schema: SummarizeLessonsOutputSchema},
  prompt: `You are an AI assistant helping students review lessons.
  Given the lesson content and the current context of the class, provide a summary that highlights key details that students might have missed or that are particularly important.

Lesson Content: {{{lessonContent}}}

Context: {{{context}}}

Summary:`, // Added a colon at the end.
});

const summarizeLessonsFlow = ai.defineFlow(
  {
    name: 'summarizeLessonsFlow',
    inputSchema: SummarizeLessonsInputSchema,
    outputSchema: SummarizeLessonsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
