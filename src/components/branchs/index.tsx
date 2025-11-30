import { Typography } from "../ui/typography";

export const BranchLogo = () => {
  return (
    <Typography
      variant={"h3"}
      className="flex items-center gap-1"
      style={{
        background: "linear-gradient(var(--primary), var(--secondary))",
      }}
    >
      <span className="font-light">Pop corner</span>
    </Typography>
  );
};
