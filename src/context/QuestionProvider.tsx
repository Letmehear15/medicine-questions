import { createContext, useContext, useEffect, useState } from "react";
import { FCC } from "../types";
import { LocalstorageItems, useLocalstorage } from "../hooks/useLocalstorage";
import { EPaths, useRedirect } from "./RedirectProvider";
import { useData } from "../hooks/useData";

interface IQuestionContext {
  onLastOpenQuestionUpdate: () => void;
  onStartTesting: () => void;
  currentQuestionIndex: number;
  isTheLastQuestion: boolean;
}

export interface IAnswers {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: number;
  questionText: string;
  answers: IAnswers[];
}

const QuestionContext = createContext<IQuestionContext | null>(null);

export const QuestionProvider: FCC = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInit, setIsInit] = useState(false);
  const { setValueToLocalstorage, getFromLocalstorage } = useLocalstorage();
  const { onChangePath } = useRedirect();
  const questionLength = useData().length - 1;
  const isTheLastQuestion = currentQuestionIndex === questionLength;

  useEffect(() => {
    const lastOpenQuestionIndex = getFromLocalstorage(
      LocalstorageItems.lastOpenQuestion
    );

    if (
      lastOpenQuestionIndex &&
      Number(lastOpenQuestionIndex) &&
      Number(lastOpenQuestionIndex) > 0
    ) {
      setCurrentQuestionIndex(Number(lastOpenQuestionIndex));
    }
    setIsInit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetQuestions = () => {
    setCurrentQuestionIndex(0);
    setValueToLocalstorage(LocalstorageItems.lastOpenQuestion, 0);
  };

  const onLastOpenQuestionUpdate = () => {
    if (!isTheLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setValueToLocalstorage(
        LocalstorageItems.lastOpenQuestion,
        currentQuestionIndex + 1
      );
    } else {
      onChangePath(EPaths.MAIN);
      resetQuestions();
    }
  };

  const onStartTesting = () => {
    onChangePath(EPaths.QUESTION);
    resetQuestions();
  };

  const value = {
    onLastOpenQuestionUpdate,
    currentQuestionIndex,
    onStartTesting,
    isTheLastQuestion,
  };

  if (!isInit) {
    return null;
  }

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => {
  const context = useContext(QuestionContext);

  if (!context) {
    throw new Error("QuestionContext must be used within a AdminProvider");
  }

  return context;
};
