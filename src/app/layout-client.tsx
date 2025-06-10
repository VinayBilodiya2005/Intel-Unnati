
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { BookOpen, GraduationCap, Text, HelpCircle, ClipboardList } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-primary">ClassmateAI</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/personalized-tutoring'}
                tooltip="Personalized Tutoring"
              >
                <Link href="/personalized-tutoring">
                  <BookOpen />
                  <span className={cn("group-data-[collapsible=icon]:hidden")}>Personalized Tutoring</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/summarization'}
                tooltip="Summarization Tool"
              >
                <Link href="/summarization">
                  <Text />
                   <span className={cn("group-data-[collapsible=icon]:hidden")}>Summarization Tool</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/ask-tutor'}
                tooltip="Ask Your Teacher"
              >
                <Link href="/ask-tutor">
                  <HelpCircle />
                   <span className={cn("group-data-[collapsible=icon]:hidden")}>Ask Your Teacher</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/teacher-dashboard'}
                tooltip="Teacher Dashboard"
              >
                <Link href="/teacher-dashboard">
                  <ClipboardList />
                   <span className={cn("group-data-[collapsible=icon]:hidden")}>Teacher Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 md:justify-end">
          <SidebarTrigger className="md:hidden" />
          {/* Future: Breadcrumbs or User Profile Dropdown */}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
