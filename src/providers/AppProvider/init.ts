import { parseJsonObject } from "~/utils/json";
import { AppUser } from "./type";

export const getInitUser = (): AppUser | null => {
  const user = parseJsonObject(localStorage.getItem("user"), {});

  return Object.keys(user).length > 0 ? (user as AppUser) : null;
};
