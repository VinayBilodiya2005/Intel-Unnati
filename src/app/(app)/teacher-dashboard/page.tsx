
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ClipboardList } from 'lucide-react';

export default function TeacherDashboardPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <PageHeader
        title="Teacher Dashboard"
        description="View and respond to student questions."
        icon={ClipboardList}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Pending Student Questions</CardTitle>
          <CardDescription>
            This is where questions submitted by students will appear. 
            (This is a placeholder page. Functionality for displaying and answering questions needs to be implemented.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No questions to display at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Future enhancements will include a list of questions, filtering options, and an interface to provide answers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for other teacher-specific tools or information */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">Quick Links & Tools</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Links to other teacher resources or AI tools (like summarization for lesson planning) could be placed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
