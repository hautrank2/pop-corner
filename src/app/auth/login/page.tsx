"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { internalHttpClient } from "~/api/httpClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginResponse } from "~/types/auth";
import { useState } from "react";
import { Separator } from "~/components/ui/separator";
import { PasswordInput } from "~/components/ui/password-input";
import { signIn } from "next-auth/react";

// ----- Zod schema -----
const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const data = {
        email: values.email,
        password: values.password,
      };
      await internalHttpClient.post<LoginResponse>(`/api/login`, data);
      router.push(`/`);
    } catch (err) {
      toast.error(JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSigninGoogle = async () => {
    const signInRes = await signIn("google", { redirect: false });
    console.log(signInRes);
  };

  return (
    <div
      className={cn(
        "flex text-foreground bg-background"
        // "bg-[url(/img/login-bg.jpg)] bg-bottom bg-no-repeat bg-contain"
      )}
    >
      {/* Right panel: login form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <Card className="w-full max-w-md border-border bg-card/95 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Login
            </CardTitle>
            <CardDescription>
              Enter your email and password to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-sidebar-border bg-background/60"
              onClick={() => handleSigninGoogle()}
            >
              Continue with Google
            </Button>

            <Separator />
            <div className="flex items-center justify-center">
              <span className="text-xs text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </a>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
