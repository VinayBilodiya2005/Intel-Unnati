"use client";

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Text as TextIcon } from 'lucide-react'; // Renamed to avoid conflict with HTML Text

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { AiResponseDisplay } from '@/components/ai-response-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { summarizeLessonAction } from '@/lib/actions';
import type { SummarizeLessonsOutput } from "@/ai/flows/summarize-lessons";


const formSchema = z.object({
  lessonContent: z.string().min(20, "Lesson content must be at least 20 characters long."),
  context: z.string().min(10, "Class context must be at least 10 characters long."),
});

type SummarizationFormValues = z.infer<typeof formSchema>;

const initialState = {
  success: false,
  data: undefined,
  error: undefined,
  fieldErrors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <LoadingSpinner className="mr-2" /> : null}
      Generate Summary
    </Button>
  );
}

export default function SummarizationPage() {
  const [formState, dispatchFormAction] = useFormState(summarizeLessonAction, initialState);
  const [aiResponse, setAiResponse] = useState<SummarizeLessonsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<SummarizationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonContent: '',
      context: '',
    },
     mode: "onChange",
  });

  useEffect(() => {
    if (formState.success && formState.data) {
      setAiResponse(formState.data);
      toast({ title: "Success!", description: "Summary generated successfully." });
      form.reset(); 
    } else if (formState.error) {
      toast({
        title: "Error Generating Summary",
        description: formState.error,
        variant: "destructive",
      });
    }
     if (formState.fieldErrors) {
      Object.entries(formState.fieldErrors).forEach(([field, errors]) => {
         if (errors && errors.length > 0) {
          form.setError(field as keyof SummarizationFormValues, {
            type: 'manual',
            message: errors.join(', '),
          });
        }
      });
    }
  }, [formState, toast, form]);

  const onSubmit = (values: SummarizationFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    setAiResponse(null); 
    dispatchFormAction(formData);
  };


  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PageHeader
        title="Summarization Tool"
        description="Generate concise summaries of lessons, highlighting key details."
        icon={TextIcon}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Lesson Information</CardTitle>
          <CardDescription>Provide the lesson content and class context to generate a summary.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="lessonContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste or type the full content of the lesson here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the current context of the class (e.g., recent topics, student difficulties, learning objectives)."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>

      {aiResponse && (
        <AiResponseDisplay
          title="Lesson Summary"
          content={aiResponse.summary}
          className="mt-8 shadow-lg"
        />
      )}
    </div>
  );
}
