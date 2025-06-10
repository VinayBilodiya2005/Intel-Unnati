
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ClipboardList, Inbox, Lightbulb, BookCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <PageHeader
        title="Teacher Dashboard"
        description="View and respond to student questions, access teaching tools, and manage your classes."
        icon={ClipboardList}
      />

      <Card className="shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Inbox className="h-6 w-6 text-primary" />
            Pending Student Questions
          </CardTitle>
          <CardDescription>
            Review and answer questions submitted by your students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-10 text-center bg-muted/20">
            <Inbox className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Questions Yet</h3>
            <p className="text-muted-foreground">
              When students submit questions, they will appear here.
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              (This area is currently a placeholder. Future enhancements will include a list of questions, filtering options, and an interface to provide answers.)
            </p>
          </div>
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
