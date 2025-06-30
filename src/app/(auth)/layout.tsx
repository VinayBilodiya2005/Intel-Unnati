
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Link href="/" className="mb-8 flex items-center gap-3 group">
        <Image
          src="/logo.png"
          alt="ClassmateAI Logo"
          width={48}
          height={48}
          className="transition-transform group-hover:scale-110"
        />
        <h1 className="text-4xl font-headline font-bold text-primary transition-colors group-hover:text-primary/90">ClassmateAI</h1>
      </Link>
      <main className="w-full max-w-md">
        {children}
      </main>
       <p className="mt-10 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ClassmateAI. All rights reserved.
      </p>
    </div>
  );
}
