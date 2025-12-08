"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { PasswordInput } from "~/components/ui/password-input";
import { AllProviders } from "~/providers";
import { useMutation } from "@tanstack/react-query";
import { httpClient, internalHttpClient } from "~/api";
import { SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL } from "~/lib/session";
import { useRouter } from "next/navigation";
import { getPath } from "~/lib/navigate";
import { toast } from "sonner";
import Cookie from "js-cookie";

const ForgotPasswordSchema = z
  .object({
    password: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

type ForgotPasswordRequest = Omit<ForgotPasswordValues, "confirmPassword">;
const ForgotPasswordPage = () => {
  return (
    <AllProviders>
      <_ForgotPasswordPage />
    </AllProviders>
  );
};

export default ForgotPasswordPage;

const _ForgotPasswordPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["update", "password"],
    mutationFn: (data: ForgotPasswordRequest) =>
      httpClient.put("/api/auth/password", data),
    onSuccess: async () => {
      await internalHttpClient.delete("/api/cookie", {
        params: { keys: [SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL] },
      });
      router.push(getPath().login);
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = async (values: ForgotPasswordValues) => {
    if (mutation.isPending) return;
    setServerError(null);
    setServerSuccess(null);

    try {
      await mutation.mutateAsync(values);
    } catch (err: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex mt-20 items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new one.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Re-enter your new password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              {serverSuccess && (
                <p className="text-sm text-emerald-600">{serverSuccess}</p>
              )}

              <CardFooter className="px-0 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Updating..." : "Update password"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
