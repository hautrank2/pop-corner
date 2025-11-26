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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

// Đổi import này theo đường dẫn Dropzone của bạn
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "~/components/ui/shadcn-io/dropzone";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  birthday: z
    .string()
    .min(1, "Birthday is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Please select a valid date.",
    }),
  // Optional avatar: 0 hoặc 1 file
  avatar: z
    .array(z.instanceof(File))
    .max(1, "You can upload only one avatar.")
    .optional(),
});

type SignupFormValues = z.infer<typeof SignupSchema>;

const SignupPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthday: "",
      avatar: [],
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);

    // TODO: Call your signup API / server action here
    // e.g. await signupAction(values)
    console.log("Signup submit:", values);

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div
      className={cn(
        "flex min-h-screen text-foreground bg-background"
        // "bg-[url(/img/login-bg.jpg)] bg-bottom bg-no-repeat bg-contain"
      )}
    >
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <Card className="w-full max-w-md border-border bg-card/95 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign up
            </CardTitle>
            <CardDescription>
              Create an account to start tracking your favorite movies.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="bg-background"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          autoComplete="new-password"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Birthday */}
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Avatar (optional) */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => {
                    const files = field.value ?? [];

                    const handleDrop = (dropped: File[]) => {
                      // Giới hạn 1 file cho avatar
                      const next = dropped.slice(0, 1);
                      field.onChange(next);
                    };

                    return (
                      <FormItem className="space-y-2">
                        <FormLabel>Avatar (optional)</FormLabel>
                        <FormControl>
                          <Dropzone
                            accept={{ "image/*": [] }}
                            maxFiles={1}
                            maxSize={1024 * 1024 * 10}
                            minSize={1024}
                            onDrop={handleDrop}
                            onError={console.error}
                            src={files}
                          >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                          </Dropzone>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
