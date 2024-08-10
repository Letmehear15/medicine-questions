import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  points: number;
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
    setIsLoading,
  } = useGetData();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [currentWrongQuestionIndex, setCurrentWrongQuestionIndex] = useState(0);

  const [wrongAnswerIndexes, setWrongAnswerIndexes] = useState<number[]>([]);

  const { onChangePath, path } = useRedirect();
  const questionLength = useData().length;

  useLayoutEffect(() => {
    if (path === EPaths.MAIN && !isLoading) {
      if (wrongAnswers) {
        setWrongAnswerIndexes(wrongAnswers);
      }

      if (lastOpenQuestion) {
        setCurrentQuestionIndex(lastOpenQuestion);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (path === EPaths.MAIN) {
      setCurrentWrongQuestionIndex(0);
    }
  }, [path]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const isTheLastWrongAnswer =
    currentWrongQuestionIndex === wrongAnswers.length - 1;

  const currentWrongAnswer = wrongAnswers[currentWrongQuestionIndex];
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
      const selectedQuestionBlock = Math.ceil(
        currentQuestionIndex / QUESTIONS_PER_GROUP
      );

      const newStatisticValue: IStatistic = {
        date: new Date().toLocaleDateString(),
        selectedQuestionBlock,
        countOfWrongAnswers: wrongAnswerIndexes.reduce((acc, cur) => {
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

      setIsLoading(true);
      onChangePath(EPaths.MAIN);
      await putData({ statistic: [newStatisticValue, ...statistic] });

      await resetQuestions();
    }
  };

  const onStartTesting = async (currentQuestion: number) => {
    setCurrentQuestionIndex(currentQuestion);
    onChangePath(EPaths.QUESTION);
    await putData({ lastOpenQuestion: currentQuestion });
  };

  const onNextWrongAnswers = () => {
    if (!isTheLastWrongAnswer) {
      setCurrentWrongQuestionIndex((prev) => prev + 1);
    } else {
      setIsLoading(true);
      onChangePath(EPaths.MAIN);
      setCurrentWrongQuestionIndex(0);
    }
  };

  const onAddWrongAnswer = async () => {
    if (wrongAnswerIndexes.includes(currentQuestionIndex)) {
      return;
    }
    if (wrongAnswerIndexes.length > 0) {
      const newWrongAnswers = [
        ...new Set([...wrongAnswerIndexes, currentQuestionIndex]),
      ];

      await putData({ wrongAnswers: newWrongAnswers });
    } else {
      await putData({ wrongAnswers: [currentQuestionIndex] });
    }

    setWrongAnswerIndexes([...wrongAnswerIndexes, currentQuestionIndex]);
  };

  const removeWrongAnswer = async () => {
    if (
      !wrongAnswerIndexes.includes(currentQuestionIndex) &&
      !isWrongAnswerPage
    ) {
      return;
    }
    if (wrongAnswerIndexes) {
      const questionIndex = isWrongAnswerPage
        ? currentWrongAnswer
        : currentQuestionIndex;

      const filteredWrongAnswers = wrongAnswerIndexes.filter(
        (answer: number) => answer !== questionIndex
      );

      setWrongAnswerIndexes(filteredWrongAnswers);
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
    wrongAnswerIndexes: wrongAnswers,
    currentWrongQuestionIndex,
    removeWrongAnswer,
    isTheLastQuetiosnInGroup,
    statistic,
    setIsLoading,
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
