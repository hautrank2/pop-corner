import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const OtpForm = ({
  otp,
  setOtp,
  onSubmit,
  onBack,
  loading,
}: {
  otp: string;
  setOtp: (v: string) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!loading) onSubmit();
    }}
    className="space-y-4"
  >
    <p className="text-sm text-muted-foreground">OTP sent to your email</p>

    <div className="space-y-2">
      <Label>OTP</Label>
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={loading}
        autoFocus
      />
    </div>

    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={loading}
      >
        Back
      </Button>

      <Button className="flex-1" disabled={!otp || loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  </form>
);
