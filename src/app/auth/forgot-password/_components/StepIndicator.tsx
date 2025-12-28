type Step = 1 | 2 | 3;

export const StepIndicator = ({ step }: { step: Step }) => {
  const steps = ["Email", "OTP", "Password"];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, index) => {
        const current = index + 1;
        const isActive = step === current;
        const isDone = step > current;

        return (
          <div key={label} className="flex items-center w-full">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
            >
              {current}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-[2px] w-full ${
                  isDone ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
