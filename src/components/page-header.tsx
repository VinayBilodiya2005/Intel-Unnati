import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, className, children }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {Icon && <Icon className="h-7 w-7 text-primary" />}
            <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">{title}</h1>
          </div>
          {description && <p className="text-base text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="mt-4 sm:mt-0">{children}</div>}
      </div>
    </div>
  );
}
