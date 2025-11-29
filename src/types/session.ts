import { SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL } from "~/lib/session";
import { UserModel } from "./user";

export type SessionPayload = {
  token: string;
  userData: UserModel;
};

export type SessionPayloadResponse = {
  [SESSION_TOKEN_LOCAL]: string;
  [SESSION_USER_LOCAL]: string;
};
