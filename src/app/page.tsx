import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/personalized-tutoring');
  // Return null because redirect will throw a special Next.js error to initiate the redirect.
  // Alternatively, you can return a loading component if the redirect is conditional or might take time.
  return null;
}
