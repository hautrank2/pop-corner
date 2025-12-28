import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const EmailForm = ({
  email,
  setEmail,
  onSubmit,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!loading) onSubmit();
    }}
    className="space-y-4"
  >
    <div className="space-y-2">
      <Label>Email</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        autoFocus
      />
    </div>

    <Button className="w-full" disabled={!email || loading}>
      {loading ? "Sending OTP..." : "Send OTP"}
    </Button>
  </form>
);
