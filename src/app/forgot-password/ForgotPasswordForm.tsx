"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { auth } from "../../../utils/auth";
import { toast } from "sonner";
import { getAuthError } from "../../../utils/auth-errors";
import { Icons } from "@/components/Icons";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await auth.resetPasswordRequest(email);
      toast("Check your email", { description: "response.message" });
      router.push("/login");
    } catch (error) {
      const { message } = getAuthError(error);
      toast.error("Reset Password Error", {
        description: JSON.stringify(message),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-xs">
            Enter your email address and we will send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button className="w-full" type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset link
          </Button>
        </CardContent>
        <CardFooter>
          <div className="text-sm">
            Remeber your password?{" "}
            <Link href="/login" className="text-blue-500">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
