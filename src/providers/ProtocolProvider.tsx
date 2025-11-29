"use client";

import React, { useReducer, createContext, useContext } from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  webSockets: { key: string; instance: WebSocket }[];
  ws: { key: string; instance: WebSocket }[];
};

type Action = {
  type: string;
  payload: any;
};

interface AppContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const initialState: State = {
  webSockets: [],
  ws: [],
};

const reducer = (state: State, action: Action): State => {
  const webSockets = state.webSockets.slice();
  switch (action.type) {
    case "addWs":
      const { key, instance } = action.payload;
      const index = webSockets.findIndex((ws) => ws.key === key);
      if (index === -1) {
        // websocket exist
        webSockets.push({ key, instance });
      }
      return {
        ...state,
        webSockets,
      };

    case "addWebSocket": {
      const { key: keyAdd, instance: instanceAdd } = action.payload;
      const index = webSockets.findIndex((ws) => ws.key === keyAdd);
      if (index === -1) {
        // websocket exist
        webSockets.push({ key: keyAdd, instance: new WebSocket(keyAdd) });
      }
      return {
        ...state,
        ws: webSockets,
      };
      break;
    }
    case "removeWs":
      const removeIndex = webSockets.findIndex((ws) => ws.key === key);
      if (removeIndex !== -1) {
        // websocket exist
        webSockets.splice(removeIndex, 1);
      }
      return {
        ...state,
        webSockets,
      };
    default:
      throw new Error("Unknown action");
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ProtocolProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useProtocolCtx = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useProtocol Context must be used within an AppProvider");
  }
  return context;
};

export type IAppState = State;

export { useProtocolCtx };
