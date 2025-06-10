// use server'

/**
 * @fileOverview Generates personalized explanations for challenging topics, tailored to the student's age and background.
 *
 * - generatePersonalizedExplanation - A function that generates personalized explanations.
 * - GeneratePersonalizedExplanationInput - The input type for the generatePersonalizedExplanation function.
 * - GeneratePersonalizedExplanationOutput - The return type for the generatePersonalizedExplanation function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedExplanationInputSchema = z.object({
  topic: z.string().describe('The topic to explain.'),
  studentAge: z.number().describe('The age of the student.'),
  studentBackground: z.string().describe('The background of the student.'),
});
export type GeneratePersonalizedExplanationInput = z.infer<
  typeof GeneratePersonalizedExplanationInputSchema
>;

const GeneratePersonalizedExplanationOutputSchema = z.object({
  explanation: z.string().describe('The personalized explanation for the topic.'),
});
export type GeneratePersonalizedExplanationOutput = z.infer<
  typeof GeneratePersonalizedExplanationOutputSchema
>;

export async function generatePersonalizedExplanation(
  input: GeneratePersonalizedExplanationInput
): Promise<GeneratePersonalizedExplanationOutput> {
  return generatePersonalizedExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedExplanationPrompt',
  input: {schema: GeneratePersonalizedExplanationInputSchema},
  output: {schema: GeneratePersonalizedExplanationOutputSchema},
  prompt: `You are an expert tutor. Your task is to explain the following topic to a student.

Topic: {{{topic}}}
Student Age: {{{studentAge}}}
Student Background: {{{studentBackground}}}

Provide a clear and concise explanation tailored to the student's age and background. Use examples that are relevant to the student's experience. Break down complex concepts into simpler terms.
`,
});

const generatePersonalizedExplanationFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedExplanationFlow',
    inputSchema: GeneratePersonalizedExplanationInputSchema,
    outputSchema: GeneratePersonalizedExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
