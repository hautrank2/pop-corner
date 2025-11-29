export type AppTheme = "light" | "dark";
export type AppFont =
  | "Roboto"
  | "Lexend"
  | "Inter"
  | "Open Sans"
  | "Quicksand"
  | "Manrope"
  | "Nunito"
  | "Fira";

export type AppUser = {
  user_id: string;
  username: string;
  token: string;
};
