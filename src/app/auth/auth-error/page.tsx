import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorMessage } = await searchParams;

  return (
    <div className="flex items-center justify-center h-minus-135">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with the authentication process
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground"></p>
          {errorMessage}
          <ul className="list-disc list-inside mt-2">
            <li>An expired or invalid link</li>
            <li>A cancelled OAuth process</li>
            <li>A technical issue</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
