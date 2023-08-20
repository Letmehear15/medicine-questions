import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { FCC } from "../types";
import { LocalstorageItems, useLocalstorage } from "../hooks/useLocalstorage";
import { EPaths, useRedirect } from "./RedirectProvider";
import { QUESTIONS_PER_GROUP } from "../pages/question-division/QuestionDivision";
import { useData } from "../hooks/useData";

interface IQuestionContext {
  onLastOpenQuestionUpdate: () => void;
  onStartTesting: (currentQuestion: number) => void;
  onAddWrongAnswer: () => void;
  onNextWrongAnswers: () => void;
  removeWrongAnswer: () => void;
  currentQuestionIndex: number;
  currentWrongAnswer: number;
  isTheLastQuetiosnInGroup: boolean;
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

export interface IStatistic {
  date: string;
  selectedQuestionBlock: number;
  countOfWrongAnswers: number;
  questionsInBlock: number;
}

const QuestionContext = createContext<IQuestionContext | null>(null);

export const QuestionProvider: FCC = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentWrongQuestionIndex, setCurrentWrongQuestionIndex] = useState(0);
  const [isInit, setIsInit] = useState(false);
  const [wrongAnswerIndexes, setWrongAnswerIndexes] = useState<number[]>([]);

  const { setValueToLocalstorage, getFromLocalstorage } = useLocalstorage();
  const { onChangePath, path } = useRedirect();
  const questionLength = useData().length;

  const isTheLastWrongAnswer =
    currentWrongQuestionIndex === wrongAnswerIndexes.length - 1;

  const currentWrongAnswer = wrongAnswerIndexes[currentWrongQuestionIndex];
  const isTheLastQuetiosnInGroup =
    (currentQuestionIndex + 1) % QUESTIONS_PER_GROUP === 0 ||
    currentQuestionIndex + 1 === questionLength;

  const isWrongAnswerPage = path === EPaths.WRONG_ANSWERS;

  useEffect(() => {
    const lastOpenQuestionIndex = Number(
      getFromLocalstorage(LocalstorageItems.lastOpenQuestion)
    );
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);
    const statistic = getFromLocalstorage(LocalstorageItems.statistic);

    if (lastOpenQuestionIndex > 0) {
      setCurrentQuestionIndex(lastOpenQuestionIndex);
    }

    if (wrongAnswers) {
      setWrongAnswerIndexes(wrongAnswers);
    }

    if (!statistic) {
      setValueToLocalstorage(LocalstorageItems.statistic, []);
    }
    setIsInit(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (path === EPaths.MAIN) {
      const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);
      if (wrongAnswers) {
        setWrongAnswerIndexes(wrongAnswers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const resetQuestions = () => {
    setCurrentQuestionIndex(0);
    setValueToLocalstorage(LocalstorageItems.lastOpenQuestion, 0);
  };

  const onLastOpenQuestionUpdate = () => {
    if (!isTheLastQuetiosnInGroup) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setValueToLocalstorage(
        LocalstorageItems.lastOpenQuestion,
        currentQuestionIndex + 1
      );
    } else {
      onChangePath(EPaths.MAIN);

      const wrongAnswers: number[] = getFromLocalstorage(
        LocalstorageItems.wrongAnswers
      );

      const selectedQuestionBlock = Math.ceil(
        currentQuestionIndex / QUESTIONS_PER_GROUP
      );

      const newStatisticValue: IStatistic = {
        date: new Date().toLocaleDateString(),
        selectedQuestionBlock,
        countOfWrongAnswers: wrongAnswers.reduce((acc, cur) => {
          const minQuestionIndex =
            selectedQuestionBlock * QUESTIONS_PER_GROUP -
            (QUESTIONS_PER_GROUP + 1);
          const maxQuestionIndex = currentQuestionIndex;

          if (cur >= minQuestionIndex && cur <= maxQuestionIndex) {
            acc++;
          }

          return acc;
        }, 0),

        questionsInBlock:
          currentQuestionIndex +
          1 -
          (selectedQuestionBlock - 1) * QUESTIONS_PER_GROUP,
      };

      const oldStatisticValues = getFromLocalstorage(
        LocalstorageItems.statistic
      );

      setValueToLocalstorage(LocalstorageItems.statistic, [
        newStatisticValue,
        ...oldStatisticValues,
      ]);

      resetQuestions();
    }
  };

  const onStartTesting = (currentQuestion: number) => {
    onChangePath(EPaths.QUESTION);
    setCurrentQuestionIndex(currentQuestion);
    setValueToLocalstorage(LocalstorageItems.lastOpenQuestion, currentQuestion);
  };

  const onNextWrongAnswers = () => {
    if (!isTheLastWrongAnswer) {
      setCurrentWrongQuestionIndex((prev) => prev + 1);
    } else {
      onChangePath(EPaths.MAIN);
      setCurrentWrongQuestionIndex(0);
    }
  };

  const onAddWrongAnswer = () => {
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);

    if (wrongAnswers) {
      setValueToLocalstorage(LocalstorageItems.wrongAnswers, [
        ...new Set([...wrongAnswers, currentQuestionIndex]),
      ]);
    } else {
      setValueToLocalstorage(LocalstorageItems.wrongAnswers, [
        currentQuestionIndex,
      ]);
    }

    setWrongAnswerIndexes([
      ...new Set([...wrongAnswerIndexes, currentQuestionIndex]),
    ]);
  };

  const removeWrongAnswer = () => {
    const wrongAnswers = getFromLocalstorage(LocalstorageItems.wrongAnswers);

    if (wrongAnswers) {
      const questionIndex = isWrongAnswerPage
        ? currentWrongAnswer
        : currentQuestionIndex;

      const filteredWrongAnswers = wrongAnswers.filter(
        (answer: number) => answer !== questionIndex
      );

      setValueToLocalstorage(
        LocalstorageItems.wrongAnswers,
        filteredWrongAnswers
      );
    }
  };

  const value: IQuestionContext = {
    onLastOpenQuestionUpdate,
    currentQuestionIndex,
    onStartTesting,
    onAddWrongAnswer,
    onNextWrongAnswers,
    currentWrongAnswer,
    isTheLastWrongAnswer,
    wrongAnswerIndexes,
    currentWrongQuestionIndex,
    removeWrongAnswer,
    isTheLastQuetiosnInGroup,
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
