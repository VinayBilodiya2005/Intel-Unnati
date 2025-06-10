
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ClipboardList, Inbox, Lightbulb, BookCopy, Trash2, UserCircle, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import type { StudentQuestionInput as BaseStudentQuestionInput } from "@/ai/flows/student-question-flow";

// Add an ID to the question for list rendering and potential future operations
interface StudentQuestion extends BaseStudentQuestionInput {
  id: string;
}

export default function TeacherDashboardPage() {
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedQuestionsRaw = localStorage.getItem('studentQuestions');
      if (storedQuestionsRaw) {
        const parsedQuestions: StudentQuestion[] = JSON.parse(storedQuestionsRaw);
        setQuestions(parsedQuestions.reverse()); // Show newest first
      }
    } catch (e) {
      console.error("Failed to load questions from localStorage", e);
      toast({
        title: "Loading Error",
        description: "Could not load questions from local storage.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleClearQuestions = () => {
    try {
      localStorage.removeItem('studentQuestions');
      setQuestions([]);
      toast({
        title: "Questions Cleared",
        description: "All student questions have been cleared from local storage.",
      });
    } catch (e) {
      console.error("Failed to clear questions from localStorage", e);
      toast({
        title: "Clearing Error",
        description: "Could not clear questions from local storage.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <PageHeader
        title="Teacher Dashboard"
        description="View and respond to student questions, access teaching tools, and manage your classes."
        icon={ClipboardList}
      />

      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-6 w-6 text-primary" />
              Pending Student Questions
            </div>
            {questions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClearQuestions}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Questions
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Review and answer questions submitted by your students. (Demo: Questions are stored in your browser's local storage)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner size={32} />
            </div>
          ) : questions.length === 0 ? (
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-10 text-center bg-muted/20">
              <Inbox className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Questions Yet</h3>
              <p className="text-muted-foreground">
                When students submit questions, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <Card key={q.id || index} className="bg-card/50 dark:bg-card/80 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                       <MessageSquare className="h-5 w-5 text-primary" />
                       Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-foreground whitespace-pre-wrap">{q.question}</p>
                    {q.topicContext && (
                      <>
                        <Separator />
                        <div className="text-sm">
                          <strong className="flex items-center gap-1 text-muted-foreground"><Tag className="h-4 w-4"/>Topic/Context:</strong>
                          <p className="pl-1">{q.topicContext}</p>
                        </div>
                      </>
                    )}
                    {q.studentProfile && (
                      <>
                        <Separator />
                        <div className="text-sm">
                          <strong className="flex items-center gap-1 text-muted-foreground"><UserCircle className="h-4 w-4"/>Student Notes:</strong>
                           <p className="pl-1">{q.studentProfile}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                   {/* Placeholder for future actions like 'Reply' or 'Mark as Resolved' */}
                   <CardFooter className="pt-3 text-xs text-muted-foreground">
                     Submitted: {new Date(q.id.split('+')[0]).toLocaleString()} {/* Rough timestamp from ID */}
                   </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary"/>
                Quick Tools & Resources
            </CardTitle>
            <CardDescription>Access helpful AI-powered tools and resources for your teaching.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/summarization" passHref>
                <Button variant="outline" className="w-full justify-start p-6 text-left h-auto">
                    <BookCopy className="mr-3 h-5 w-5" />
                    <div>
                        <p className="font-semibold">Lesson Summarization Tool</p>
                        <p className="text-xs text-muted-foreground">Quickly summarize lesson content for planning or review.</p>
                    </div>
                </Button>
            </Link>
            <Link href="/personalized-tutoring" passHref>
                 <Button variant="outline" className="w-full justify-start p-6 text-left h-auto">
                    <Lightbulb className="mr-3 h-5 w-5" />
                    <div>
                        <p className="font-semibold">Personalized Explanation Generator</p>
                        <p className="text-xs text-muted-foreground">Generate explanations tailored to student needs.</p>
                    </div>
                </Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
