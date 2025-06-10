
"use client";

import { useEffect, useState, useActionState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { AiResponseDisplay } from '@/components/ai-response-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { answerStudentQuestionAction } from '@/lib/actions';
import type { StudentQuestionOutput } from "@/ai/flows/student-question-flow";

const formSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters long."),
  topicContext: z.string().optional(),
  studentProfile: z.string().optional(),
});

type AskTutorFormValues = z.infer<typeof formSchema>;

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
      Get Answer
    </Button>
  );
}

export default function AskTutorPage() {
  const [formState, dispatchFormAction] = useActionState(answerStudentQuestionAction, initialState);
  const [aiResponse, setAiResponse] = useState<StudentQuestionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AskTutorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      topicContext: '',
      studentProfile: '',
    },
    mode: "onChange",
  });
  
  useEffect(() => {
    if (formState.success && formState.data) {
      setAiResponse(formState.data);
      toast({ title: "Success!", description: "Answer generated successfully." });
      form.reset(); 
    } else if (formState.error) {
      toast({
        title: "Error Generating Answer",
        description: formState.error,
        variant: "destructive",
      });
    }
     if (formState.fieldErrors) {
      Object.entries(formState.fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          form.setError(field as keyof AskTutorFormValues, {
            type: 'manual',
            message: errors.join(', '),
          });
        }
      });
    }
  }, [formState, toast, form]);


  const onSubmit = async (values: AskTutorFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) { // Ensure optional fields are only appended if they have a value
        formData.append(key, String(value));
      }
    });
    setAiResponse(null); 
    startTransition(() => {
        dispatchFormAction(formData);
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PageHeader
        title="Ask Your AI Tutor"
        description="Have a question? Get a clear explanation from your AI tutor."
        icon={HelpCircle}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Your Question</CardTitle>
          <CardDescription>Enter your question and any relevant details below.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Can you explain the difference between mitosis and meiosis?"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topicContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic/Context (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cellular Reproduction, High School Biology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Background (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I'm a 10th grader and I find genetics challenging. I learn best with analogies."
                        className="min-h-[80px]"
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
          title="AI Tutor's Answer"
          content={aiResponse.answer}
          className="mt-8 shadow-lg"
        />
      )}
    </div>
  );
}
