"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { httpClient } from "~/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getPath } from "~/lib/navigate";
import { StepIndicator } from "./_components/StepIndicator";
import { EmailForm } from "./_components/EmailForm";
import { OtpForm } from "./_components/OtpForm";
import { NewPasswordForm } from "./_components/NewPasswordForm";

type Step = 1 | 2 | 3;

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <div className="flex pt-24 justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Forgot password</CardTitle>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <EmailForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              onSubmit={async () => {
                try {
                  setLoading(true);
                  await httpClient.post("/api/auth/forgot-password", { email });
                  setStep(2);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to send OTP");
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}

          {step === 2 && (
            <OtpForm
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              onBack={() => setStep(1)}
              onSubmit={async () => {
                try {
                  setLoading(true);
                  await httpClient.post(
                    "/api/auth/verify-forgot-password-otp",
                    { email, otp }
                  );
                  setStep(3);
                } catch (err) {
                  console.error(err);
                  toast.error("Invalid OTP");
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}

          {step === 3 && (
            <NewPasswordForm
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
              onBack={() => setStep(2)}
              onSubmit={async () => {
                try {
                  setLoading(true);
                  await httpClient.post("/api/auth/reset-password", {
                    email,
                    otp,
                    newPassword: password,
                  });
                  router.push(getPath().login);
                } catch (err) {
                  console.error(err);
                  toast.error("Reset password failed");
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
