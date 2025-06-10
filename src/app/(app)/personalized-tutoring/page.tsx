"use client";

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { AiResponseDisplay } from '@/components/ai-response-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { generateExplanationAction } from '@/lib/actions';
import type { GeneratePersonalizedExplanationOutput } from "@/ai/flows/generate-personalized-explanations";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  studentAge: z.coerce.number().min(5, "Student age must be at least 5.").max(100, "Student age must be at most 100."),
  studentBackground: z.string().min(10, "Student background must be at least 10 characters long."),
});

type PersonalizedTutoringFormValues = z.infer<typeof formSchema>;

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
      Generate Explanation
    </Button>
  );
}

export default function PersonalizedTutoringPage() {
  const [formState, dispatchFormAction] = useFormState(generateExplanationAction, initialState);
  const [aiResponse, setAiResponse] = useState<GeneratePersonalizedExplanationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<PersonalizedTutoringFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      studentAge: 10,
      studentBackground: '',
    },
    mode: "onChange", // useful for immediate feedback on validation
  });
  
  useEffect(() => {
    if (formState.success && formState.data) {
      setAiResponse(formState.data);
      toast({ title: "Success!", description: "Explanation generated successfully." });
      form.reset(); // Reset form fields on successful submission
    } else if (formState.error) {
      toast({
        title: "Error Generating Explanation",
        description: formState.error,
        variant: "destructive",
      });
    }
    // Handle field errors, potentially setting them in the form
     if (formState.fieldErrors) {
      Object.entries(formState.fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          form.setError(field as keyof PersonalizedTutoringFormValues, {
            type: 'manual',
            message: errors.join(', '),
          });
        }
      });
    }
  }, [formState, toast, form]);


  const onSubmit = async (values: PersonalizedTutoringFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    setAiResponse(null); // Clear previous response
    dispatchFormAction(formData);
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PageHeader
        title="Personalized Tutoring"
        description="Get tailored explanations for challenging topics based on student's age and background."
        icon={BookOpen}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Topic Details</CardTitle>
          <CardDescription>Enter the details below to generate a personalized explanation.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Photosynthesis, Quantum Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentBackground"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Background</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe the student's current understanding or interests relevant to the topic."
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
          title="Personalized Explanation"
          content={aiResponse.explanation}
          className="mt-8 shadow-lg"
        />
      )}
    </div>
  );
}
