
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, BookOpen, Text, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col items-center py-12 sm:py-16 md:py-24">
      <PageHeader
        title="Welcome to ClassmateAI"
        description="Your AI-Powered Interactive Learning Assistant. Get personalized help, summarize complex lessons, and enhance your understanding like never before."
        className="mb-10 text-center max-w-2xl"
        icon={Zap}
      />

      <div className="mb-16 rounded-lg overflow-hidden shadow-2xl">
        <Image
          src="/Student using a VR headset in the classroom.webp"
          alt="Student using a VR headset in a classroom setting"
          width={1000}
          height={600}
          className="object-cover"
          data-ai-hint="student VR classroom"
          priority
        />
      </div>

      <h2 className="text-2xl font-headline font-semibold mb-8 text-center">Key Features</h2>
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 max-w-3xl w-full">
        <div className="rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-primary mr-4" />
            <h3 className="text-xl font-semibold font-headline">Personalized Tutoring</h3>
          </div>
          <p className="text-muted-foreground">
            Stuck on a topic? Get explanations tailored to your age and background, making learning intuitive and effective.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-lg transition-all hover:shadow-xl">
          <div className="flex items-center mb-4">
            <Text className="h-8 w-8 text-primary mr-4" />
            <h3 className="text-xl font-semibold font-headline">Lesson Summarization</h3>
          </div>
          <p className="text-muted-foreground">
            Quickly grasp key details from lessons and identify what you might have missed, ensuring comprehensive understanding.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <Button asChild size="lg" className="font-semibold text-lg px-8 py-6 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="font-semibold text-lg px-8 py-6 shadow-sm hover:shadow-md transition-shadow">
          <Link href="/login">
            Login to Your Account
          </Link>
        </Button>
      </div>

      <p className="mt-16 text-center text-muted-foreground max-w-lg">
        Transform your learning experience with the power of AI. Join ClassmateAI today and unlock your full potential.
      </p>
    </div>
  );
}
