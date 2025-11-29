import { UserModel } from "./user";

export type LoginResponse = UserModel & {
  token: string;
};
