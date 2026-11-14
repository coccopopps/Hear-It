import { createContext, useContext, useReducer, useMemo } from "react";
import { ACTIONS } from "./commands.js";

const AppContext = createContext(null);

const initialState = { map: "climate", region: null, sound: true };

function reducer(state, { action, value }) {
  switch (action) {
    case ACTIONS.SELECT_MAP:
      return { ...state, map: value };
    case ACTIONS.ZOOM_TO:
      return { ...state, region: value.region };
    case ACTIONS.TOGGLE_SOUND:
      return { ...state, sound: value };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Everyone uses this: const { state, dispatch } = useApp();
export const useApp = () => useContext(AppContext);
