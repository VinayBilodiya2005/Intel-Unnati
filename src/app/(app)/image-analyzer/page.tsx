
"use client";

import { useEffect, useState, useActionState, startTransition, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ScanLine, Image as ImageIcon, Upload, AlertCircle } from 'lucide-react';
import Image from 'next/image'; // Next.js Image component

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'; // ShadCN input for file
import { PageHeader } from '@/components/page-header';
import { AiResponseDisplay } from '@/components/ai-response-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { describeImageAction } from '@/lib/actions';
import type { DescribeImageOutput } from "@/ai/flows/describe-image-flow";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formSchema = z.object({
  photoDataUri: z.string().startsWith("data:image/", { message: "Please select a valid image file." }),
});

type ImageAnalyzerFormValues = z.infer<typeof formSchema>;

const initialState = {
  success: false,
  data: undefined,
  error: undefined,
  fieldErrors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <LoadingSpinner className="mr-2" /> : null}
      Analyze Image
    </Button>
  );
}

export default function ImageAnalyzerPage() {
  const [formState, dispatchFormAction] = useActionState(describeImageAction, initialState);
  const [aiResponse, setAiResponse] = useState<DescribeImageOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ImageAnalyzerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: '',
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (formState.success && formState.data) {
      setAiResponse(formState.data);
      toast({ title: "Success!", description: "Image analyzed successfully." });
      // Optionally reset form and preview, or keep them for context
      // form.reset();
      // setImagePreview(null);
      // if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (formState.error) {
      toast({
        title: "Error Analyzing Image",
        description: formState.error,
        variant: "destructive",
      });
    }
    if (formState.fieldErrors?.photoDataUri) {
       setFileError(formState.fieldErrors.photoDataUri.join(', '));
    }
  }, [formState, toast, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null); // Clear previous file error
    setAiResponse(null); // Clear previous AI response
    form.setValue('photoDataUri', ''); // Clear form value for data URI

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFileError('Invalid file type. Please select an image (PNG, JPG, GIF, WEBP).');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue('photoDataUri', dataUri, { shouldValidate: true });
      };
      reader.onerror = () => {
        setFileError('Failed to read the image file.');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
      }
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = (values: ImageAnalyzerFormValues) => {
    if (!values.photoDataUri) {
      setFileError("Please select an image to analyze.");
      return;
    }
    setAiResponse(null); // Clear previous AI response
    const formData = new FormData();
    formData.append('photoDataUri', values.photoDataUri);
    startTransition(() => {
      dispatchFormAction(formData);
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PageHeader
        title="Image Analyzer"
        description="Upload an image and get an AI-powered description of its content."
        icon={ScanLine}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Upload Image</CardTitle>
          <CardDescription>Select an image file (PNG, JPG, GIF, WEBP, max {MAX_FILE_SIZE_MB}MB) to get its description.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="photoDataUri" // This field is for the data URI, actual file input is separate
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="image-upload" className="sr-only">Image File</FormLabel>
                    <FormControl>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                     {/* Display Zod validation error for photoDataUri if any, separate from fileError */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {fileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>File Error</AlertTitle>
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}

              {imagePreview && (
                <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={imagePreview}
                    alt="Selected image preview"
                    width={600}
                    height={400}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>

      {aiResponse && (
        <AiResponseDisplay
          title="Image Description"
          content={aiResponse.description}
          className="mt-8 shadow-lg"
        />
      )}
    </div>
  );
}
