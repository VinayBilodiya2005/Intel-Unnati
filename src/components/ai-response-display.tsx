import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AiResponseDisplayProps {
  title?: string;
  content: string | null;
  className?: string;
}

export function AiResponseDisplay({ title = "AI Response", content, className }: AiResponseDisplayProps) {
  if (content === null) {
    return null;
  }

  // Simple way to handle newlines and potential code blocks
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        return (
          <pre key={index} className="font-code bg-muted p-3 my-2 rounded-md overflow-x-auto text-sm">
            {code}
          </pre>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
         const inlineCode = part.slice(1, -1);
         return (
            <code key={index} className="font-code bg-muted px-1 py-0.5 rounded-sm text-sm">
                {inlineCode}
            </code>
         )
      }
      // Handle paragraph breaks (double newlines) and single newlines within paragraphs
      return part.split('\n\n').map((paragraph, pIndex) => (
        <p key={`${index}-${pIndex}`} className="mb-3 last:mb-0 whitespace-pre-line">
          {paragraph}
        </p>
      ));
    });
  };


  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Brain className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed">
        {renderContent(content)}
      </CardContent>
    </Card>
  );
}
