"use server";

import { z } from "zod";
import {
  generatePersonalizedExplanation,
  type GeneratePersonalizedExplanationInput,
  type GeneratePersonalizedExplanationOutput,
} from "@/ai/flows/generate-personalized-explanations";
import {
  summarizeLessons,
  type SummarizeLessonsInput,
  type SummarizeLessonsOutput,
} from "@/ai/flows/summarize-lessons";

const PersonalizedExplanationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  studentAge: z.coerce.number().min(5, "Student age must be at least 5.").max(100, "Student age must be at most 100."),
  studentBackground: z.string().min(10, "Student background must be at least 10 characters long."),
});

const SummarizationSchema = z.object({
  lessonContent: z.string().min(20, "Lesson content must be at least 20 characters long."),
  context: z.string().min(10, "Class context must be at least 10 characters long."),
});

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function generateExplanationAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<GeneratePersonalizedExplanationOutput>> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = PersonalizedExplanationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      error: "Invalid input. Please check the fields.",
    };
  }

  try {
    const input: GeneratePersonalizedExplanationInput = validatedFields.data;
    const result = await generatePersonalizedExplanation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("generateExplanationAction error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while generating the explanation.";
    return { success: false, error: errorMessage };
  }
}

export async function summarizeLessonAction(
  prevState: any,
  formData: FormData
): Promise<ActionResult<SummarizeLessonsOutput>> {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = SummarizationSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      error: "Invalid input. Please check the fields.",
    };
  }

  try {
    const input: SummarizeLessonsInput = validatedFields.data;
    const result = await summarizeLessons(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("summarizeLessonAction error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred while summarizing the lesson.";
    return { success: false, error: errorMessage };
  }
}
