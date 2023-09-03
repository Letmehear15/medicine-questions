import { createContext, useContext, useLayoutEffect, useState } from "react";
import { FCC } from "../types";
import { EPaths, useRedirect } from "./RedirectProvider";
import { QUESTIONS_PER_GROUP } from "../pages/question-division/QuestionDivision";
import { useData } from "../hooks/useData";
import { useGetData } from "../api/hooks/useGetData";
import { putData } from "../api/api";
import { ErrorPage } from "../components/ErrorPage";
import { Loading } from "../components/Loading";

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
  statistic: IStatistic[];
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
  const {
    data: { lastOpenQuestion, wrongAnswers, statistic },
    isError,
    isLoading,
  } = useGetData();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [currentWrongQuestionIndex, setCurrentWrongQuestionIndex] = useState(0);

  const [wrongAnswerIndexes, setWrongAnswerIndexes] = useState<number[]>([]);

  const { onChangePath, path } = useRedirect();
  const questionLength = useData().length;

  useLayoutEffect(() => {
    if (path === EPaths.MAIN) {
      if (wrongAnswers) {
        setWrongAnswerIndexes(wrongAnswers);
      }
    }

    if (lastOpenQuestion && wrongAnswers) {
      setWrongAnswerIndexes(wrongAnswers);
      setCurrentQuestionIndex(lastOpenQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, lastOpenQuestion, wrongAnswers]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const isTheLastWrongAnswer =
    currentWrongQuestionIndex === wrongAnswerIndexes.length - 1;

  const currentWrongAnswer = wrongAnswerIndexes[currentWrongQuestionIndex];
  const isTheLastQuetiosnInGroup =
    (currentQuestionIndex + 1) % QUESTIONS_PER_GROUP === 0 ||
    currentQuestionIndex + 1 === questionLength;

  const isWrongAnswerPage = path === EPaths.WRONG_ANSWERS;

  const resetQuestions = async () => {
    setCurrentQuestionIndex(0);
    await putData({ lastOpenQuestion: 0 });
  };

  const onLastOpenQuestionUpdate = async () => {
    if (!isTheLastQuetiosnInGroup) {
      setCurrentQuestionIndex((prev) => prev + 1);
      await putData({ lastOpenQuestion: currentQuestionIndex + 1 });
    } else {
      onChangePath(EPaths.MAIN);

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

      await putData({ statistic: [newStatisticValue, ...statistic] });

      resetQuestions();
    }
  };

  const onStartTesting = async (currentQuestion: number) => {
    onChangePath(EPaths.QUESTION);
    setCurrentQuestionIndex(currentQuestion);
    await putData({ lastOpenQuestion: currentQuestion });
  };

  const onNextWrongAnswers = () => {
    if (!isTheLastWrongAnswer) {
      setCurrentWrongQuestionIndex((prev) => prev + 1);
    } else {
      onChangePath(EPaths.MAIN);
      setCurrentWrongQuestionIndex(0);
    }
  };

  const onAddWrongAnswer = async () => {
    if (wrongAnswers) {
      const newWrongAnswers = [
        ...new Set([...wrongAnswers, currentQuestionIndex]),
      ];
      await putData({ wrongAnswers: newWrongAnswers });
    } else {
      await putData({ wrongAnswers: [currentQuestionIndex] });
    }

    setWrongAnswerIndexes([
      ...new Set([...wrongAnswerIndexes, currentQuestionIndex]),
    ]);
  };

  const removeWrongAnswer = async () => {
    if (wrongAnswers) {
      const questionIndex = isWrongAnswerPage
        ? currentWrongAnswer
        : currentQuestionIndex;

      const filteredWrongAnswers = wrongAnswers.filter(
        (answer: number) => answer !== questionIndex
      );

      await putData({ wrongAnswers: filteredWrongAnswers });
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
    statistic,
  };

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
