import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const NewPasswordForm = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onSubmit,
  onBack,
  loading,
}: {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}) => {
  const [show, setShow] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>New password</Label>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-muted-foreground"
            disabled={loading}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Confirm password</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
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

        <Button
          className="flex-1"
          disabled={!password || password !== confirmPassword || loading}
        >
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </div>
    </form>
  );
};
