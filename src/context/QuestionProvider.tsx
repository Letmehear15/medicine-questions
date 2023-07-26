import { createContext, useContext, useEffect, useState } from "react";
import { FCC } from "../types";
import { LocalstorageItems, useLocalstorage } from "../hooks/useLocalstorage";
import { EPaths, useRedirect } from "./RedirectProvider";
import { useData } from "../hooks/useData";

interface IQuestionContext {
  onLastOpenQuestionUpdate: () => void;
  onStartTesting: () => void;
  onAddWrongAnswer: () => void;
  onNextWrongAnswers: () => void;
  removeWrongAnswer: () => void;
  currentQuestionIndex: number;
  currentWrongAnswer: number;
  isTheLastQuestion: boolean;
  wrongAnswerIndexes: number[];
  isTheLastWrongAnswer: boolean;
  currentWrongQuestionIndex: number;
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
  const [currentWrongQuestionIndex, setCurrentWrongQuestionIndex] = useState(0);
  const [isInit, setIsInit] = useState(false);
  const [wrongAnswerIndexes, setWrongAnswerIndexes] = useState<number[]>([]);

  const { setValueToLocalstorage, getFromLocalstorage } = useLocalstorage();
  const { onChangePath } = useRedirect();

  const questionLength = useData().length - 1;
  const isTheLastQuestion = currentQuestionIndex === questionLength;
  const isTheLastWrongAnswer =
    currentWrongQuestionIndex === wrongAnswerIndexes.length - 1;

  const currentWrongAnswer = wrongAnswerIndexes[currentWrongQuestionIndex];

  useEffect(() => {
    const lastOpenQuestionIndex = Number(
      getFromLocalstorage(LocalstorageItems.lastOpenQuestion)
    );
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);

    if (lastOpenQuestionIndex > 0) {
      setCurrentQuestionIndex(lastOpenQuestionIndex);
    }

    if (wrongAnswers) {
      const parsedWrongAnswers = JSON.parse(wrongAnswers);
      setWrongAnswerIndexes(parsedWrongAnswers);
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

  const onNextWrongAnswers = () => {
    if (!isTheLastWrongAnswer) {
      setCurrentWrongQuestionIndex((prev) => prev + 1);
    } else {
      onChangePath(EPaths.MAIN);
      setCurrentWrongQuestionIndex(0);

      const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);
      if (wrongAnswers) {
        const parsedWrongAnswers = JSON.parse(wrongAnswers);

        setWrongAnswerIndexes(parsedWrongAnswers);
      }
    }
  };

  const onAddWrongAnswer = () => {
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);

    if (wrongAnswers) {
      const parsedWrongAnswers = JSON.parse(wrongAnswers);

      setValueToLocalstorage(
        LocalstorageItems.wrongAnswers,
        JSON.stringify([
          ...new Set([...parsedWrongAnswers, currentQuestionIndex]),
        ])
      );
    } else {
      setValueToLocalstorage(
        LocalstorageItems.wrongAnswers,
        JSON.stringify([currentQuestionIndex])
      );
    }

    setWrongAnswerIndexes([
      ...new Set([...wrongAnswerIndexes, currentQuestionIndex]),
    ]);
  };

  const removeWrongAnswer = () => {
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);

    if (wrongAnswers) {
      const parsedWrongAnswers = JSON.parse(wrongAnswers);

      setValueToLocalstorage(
        LocalstorageItems.wrongAnswers,
        JSON.stringify(
          parsedWrongAnswers.filter(
            (answer: number) => answer !== currentWrongAnswer
          )
        )
      );
    }
  };

  const value: IQuestionContext = {
    onLastOpenQuestionUpdate,
    currentQuestionIndex,
    onStartTesting,
    isTheLastQuestion,
    onAddWrongAnswer,
    onNextWrongAnswers,
    currentWrongAnswer,
    isTheLastWrongAnswer,
    wrongAnswerIndexes,
    currentWrongQuestionIndex,
    removeWrongAnswer,
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
