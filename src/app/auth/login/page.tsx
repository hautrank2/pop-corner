"use client";

import * as React from "react";
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
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import httpClient from "~/api/httpClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

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
  const [isLoading, setIsLoading] = React.useState(false);
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
      await httpClient.post(`/api/auth/login`, data);
      router.push(`/`);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError && typeof err.response?.data === "string") {
        toast.error(err.response.data);
        return;
      }

      toast.error(JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen text-foreground bg-background"
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
                        <Input
                          {...field}
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember + Sign up */}
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            // RHF expects boolean, shadcn Checkbox returns boolean | "indeterminate"
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                        <Label
                          htmlFor="remember"
                          className="text-xs text-muted-foreground"
                        >
                          Remember me
                        </Label>
                      </FormItem>
                    )}
                  />

                  <span className="text-xs text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/auth/signup"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </a>
                  </span>
                </div>

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
            >
              {/* Add Google icon here if you want */}
              Continue with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
