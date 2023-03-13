// React context Api
"use client";
import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext(null);

type Props = {
  initialState: any;
  reducer: any;
  children: React.ReactNode;
};

export const StateProvider = ({ initialState, reducer, children }: Props) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
// children => <App />
//hook which allows us to pull information from the data
export const useStateValue = () => useContext(StateContext);
