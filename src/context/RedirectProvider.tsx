import { createContext, useContext, useState } from "react";
import { FCC } from "../types";

export enum EPaths {
  MAIN = "main",
  QUESTION = "question",
  WRONG_ANSWERS = "wrongAnswers",
  QUESTION_DIVISION = "questionDivision",
}

interface IRedirectContext {
  path: EPaths;
  onChangePath: (redirectTo: EPaths) => void;
}

const RedirectContext = createContext<IRedirectContext | null>(null);

export const RedirectProvider: FCC = ({ children }) => {
  const [path, setPath] = useState<EPaths>(EPaths.MAIN);

  const onChangePath = (redirectTo: EPaths) => {
    setPath(redirectTo);
  };

  const value = {
    path,
    onChangePath,
  };

  return (
    <RedirectContext.Provider value={value}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = () => {
  const context = useContext(RedirectContext);

  if (!context) {
    throw new Error("RedirectContext must be used within a AdminProvider");
  }

  return context;
};
