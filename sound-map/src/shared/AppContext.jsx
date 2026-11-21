import { createContext, useContext, useReducer, useMemo } from "react";
import { ACTIONS } from "./commands.js";

const AppContext = createContext(null);

const initialState = { map: "wildfire", basemap: "dark", region: null, sound: true };

function reducer(state, { action, value }) {
  switch (action) {
    case ACTIONS.SELECT_MAP:    return { ...state, map: value };
    case ACTIONS.SELECT_BASEMAP:return { ...state, basemap: value };
    case ACTIONS.ZOOM_TO:       return { ...state, region: value.region };
    case ACTIONS.TOGGLE_SOUND:  return { ...state, sound: value };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
