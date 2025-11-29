"use client";

export * from "./type";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { AppFont, AppTheme, AppUser } from "./type";
import { getInitUser } from "./init";
import { SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL } from "~/lib/session";
import { internalHttpClient } from "~/api";
import { SessionPayload, SessionPayloadResponse } from "~/types/session";
import { parseJsonObject } from "~/utils/json";
import { UserModel } from "~/types/user";
import { usePathname } from "next/navigation";

const themeSet = new Set<AppTheme>(["light", "dark"]);
const fontSet = new Set<AppFont>([
  "Roboto",
  "Lexend",
  "Inter",
  "Open Sans",
  "Quicksand",
  "Manrope",
  "Nunito",
  "Fira",
]);
// Define actions
type Action =
  | { type: "SET_THEME"; payload: AppTheme }
  | { type: "SET_FONT"; payload: AppFont }
  | { type: "SET_USER"; payload: State["user"] }
  | { type: "RESET_APP" }
  | { type: "AI_ENGINES_INFORS"; payload: any[] }
  | { type: "UPDATE_SESSION"; payload: SessionPayload };

// Define state shape
interface State {
  theme: AppTheme;
  font: AppFont;
  user: AppUser | null;
  session: SessionPayload | null;
}

// Initial state
const initState = (): State => {
  if (typeof window === "undefined") {
    return {
      theme: "light",
      font: "Roboto",
      user: null,
      session: null,
    };
  }

  return {
    theme: isValidFromSet(localStorage.getItem("theme"), themeSet)
      ? (localStorage.getItem("theme") as AppTheme)
      : "light",
    font: isValidFromSet(localStorage.getItem("font"), fontSet)
      ? (localStorage.getItem("font") as AppFont)
      : "Roboto",
    user: getInitUser(),
    session: null,
  };
};

// Reducer
function AppReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_THEME":
      localStorage.setItem("theme", action.payload);
      return { ...state, theme: action.payload };
    case "SET_FONT":
      localStorage.setItem("font", action.payload);
      return { ...state, font: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "RESET_APP":
      return { ...initState(), user: null };
    case "UPDATE_SESSION":
      return { ...state, session: action.payload };
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: State;
  dispatch: Dispatch<Action>;
  actions: {
    onLogout: () => void;
  };
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initState());
  const pathname = usePathname();

  // GET COOKIEs
  const fetchCookie = useCallback(async () => {
    const cookieKeys = [SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL];
    try {
      const cookieRes = await internalHttpClient.get<SessionPayloadResponse>(
        "/api/cookie",
        {
          params: { keys: cookieKeys.join(",") },
        }
      );
      if (cookieRes.data) {
        const { auth_user_data, auth_token } = cookieRes.data;
        if (!!auth_user_data && !!auth_token) {
          dispatch({
            type: "UPDATE_SESSION",
            payload: {
              userData: parseJsonObject(auth_user_data, {}) as UserModel,
              token: auth_token,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onLogout = useCallback(async () => {
    try {
      await internalHttpClient.post("/api/auth/logout");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchCookie();
  }, [pathname]);

  return (
    <AppContext.Provider value={{ state, dispatch, actions: { onLogout } }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use App
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

function isValidFromSet<T extends string>(
  value: any,
  validSet: Set<T>
): value is T {
  return validSet.has(value);
}
