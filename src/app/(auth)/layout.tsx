
import type { ReactNode } from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <GraduationCap className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-headline font-semibold text-primary">ClassmateAI</h1>
      </Link>
      <main className="w-full max-w-md">
        {children}
      </main>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ClassmateAI. All rights reserved.
      </p>
    </div>
  );
}
