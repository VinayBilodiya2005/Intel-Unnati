
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, BookOpen, Text } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col items-center py-12 sm:py-16 md:py-24">
      <PageHeader
        title="Welcome to ClassmateAI"
        description="Your AI-Powered Interactive Learning Assistant. Get personalized help, summarize complex lessons, and enhance your understanding like never before."
        className="mb-8 text-center"
      />

      <div className="mb-12">
        <Image
          src="https://placehold.co/600x400.png"
          alt="ClassmateAI in action"
          width={600}
          height={400}
          className="rounded-lg shadow-xl"
          data-ai-hint="education learning"
          priority
        />
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 max-w-2xl w-full">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <BookOpen className="h-7 w-7 text-primary mr-3" />
            <h3 className="text-xl font-semibold font-headline">Personalized Tutoring</h3>
          </div>
          <p className="text-muted-foreground">
            Stuck on a topic? Get explanations tailored to your age and background.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center mb-3">
            <Text className="h-7 w-7 text-primary mr-3" />
            <h3 className="text-xl font-semibold font-headline">Lesson Summarization</h3>
          </div>
          <p className="text-muted-foreground">
            Quickly grasp key details from lessons and identify what you might have missed.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button asChild size="lg" className="font-semibold">
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-semibold">
          <Link href="/login">
            Login to Your Account
          </Link>
        </Button>
      </div>

      <p className="mt-12 text-center text-muted-foreground">
        Transform your learning experience with the power of AI.
      </p>
    </div>
  );
}
