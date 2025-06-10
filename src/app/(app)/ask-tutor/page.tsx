
"use client";

import { useEffect, useState, useActionState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { answerStudentQuestionAction } from '@/lib/actions';
import type { SubmitQuestionToTeacherOutput } from "@/lib/actions";

const formSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters long."),
  topicContext: z.string().optional(),
  studentProfile: z.string().optional(),
});

type AskTeacherFormValues = z.infer<typeof formSchema>;

const initialState: {
  success: boolean;
  data?: SubmitQuestionToTeacherOutput;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} = {
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
      Submit Question
    </Button>
  );
}

export default function AskTeacherPage() {
  const [formState, dispatchFormAction] = useActionState(answerStudentQuestionAction, initialState);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AskTeacherFormValues>({
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
      setSubmissionMessage(formState.data.message);
      toast({ title: "Success!", description: "Your question has been submitted." });
      form.reset(); 
    } else if (formState.error) {
      setSubmissionMessage(null); 
      toast({
        title: "Error Submitting Question",
        description: formState.error,
        variant: "destructive",
      });
    }
     if (formState.fieldErrors) {
      setSubmissionMessage(null);
      Object.entries(formState.fieldErrors).forEach(([field, errors]) => {
        if (errors && errors.length > 0) {
          form.setError(field as keyof AskTeacherFormValues, {
            type: 'manual',
            message: errors.join(', '),
          });
        }
      });
    }
  }, [formState, toast, form]);


  const onSubmit = async (values: AskTeacherFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) { 
        formData.append(key, String(value));
      }
    });
    setSubmissionMessage(null); 
    startTransition(() => {
        dispatchFormAction(formData);
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PageHeader
        title="Ask Your Teacher"
        description="Have a question for your teacher? Submit it here and they will get back to you."
        icon={HelpCircle}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Your Question</CardTitle>
          <CardDescription>Enter your question and any relevant details below. Your teacher will review it.</CardDescription>
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
                        placeholder="e.g., I'm having trouble understanding the concept of photosynthesis in chapter 3."
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
                      <Input placeholder="e.g., Chapter 3: Cellular Respiration, Homework Assignment 2" {...field} />
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
                    <FormLabel>Additional Notes for Your Teacher (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I've already reviewed the class notes and watched the supplementary video."
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

      {submissionMessage && (
        <Card className="mt-8 shadow-lg border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
              Question Submitted!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{submissionMessage}</p>
            <p className="text-sm text-muted-foreground mt-2">Your teacher will be notified. You can check back later for a response or await notification according to your class setup.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
