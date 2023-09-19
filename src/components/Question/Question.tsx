import React, { useMemo, useState } from "react";
import { IQuestion, useQuestion } from "../../context/QuestionProvider";
import { Button, Stack, Typography } from "@mui/material";
import { useData } from "../../hooks/useData";
import { Answers } from "../Answers";
import { EPaths, useRedirect } from "../../context/RedirectProvider";
import { shuffleArray } from "../../utils/utils";

export const Question = () => {
  const {
    currentQuestionIndex,
    onLastOpenQuestionUpdate,
    isTheLastWrongAnswer,
    onNextWrongAnswers,
    currentWrongQuestionIndex,
    currentWrongAnswer,
    wrongAnswerIndexes,
    isTheLastQuetiosnInGroup,
  } = useQuestion();

  const questions = useData();
  const { path } = useRedirect();
  const [wasChecked, setWasChecked] = useState(false);

  const isWrongAnswerPage = path === EPaths.WRONG_ANSWERS;

  const questionIndex = isWrongAnswerPage
    ? currentWrongAnswer
    : currentQuestionIndex;

  const { questionText, answers }: IQuestion = questions[questionIndex];

  const numberOfQuestion = isWrongAnswerPage
    ? currentWrongQuestionIndex + 1
    : currentQuestionIndex + 1;

  const questionLength = isWrongAnswerPage
    ? wrongAnswerIndexes.length
    : questions.length;

  const onNextQuestion = () => {
    if (!isWrongAnswerPage) {
      onLastOpenQuestionUpdate();
    } else {
      onNextWrongAnswers();
    }
    setWasChecked(false);
  };

  const shuffledAnswers = useMemo(() => {
    return shuffleArray(answers);
  }, [answers]);

  return (
    <Stack gap={3} minHeight="100dvh">
      <Typography textAlign="center">
        {numberOfQuestion}/{questionLength}
      </Typography>

      <Stack gap={3}>
        <Typography variant="h6">{questionText}</Typography>

        <Answers
          wasChecked={wasChecked}
          setWasChecked={setWasChecked}
          answers={shuffledAnswers}
        />
      </Stack>

      {wasChecked && (
        <Button variant="contained" onClick={onNextQuestion}>
          {(isTheLastQuetiosnInGroup && !isWrongAnswerPage) ||
          (isTheLastWrongAnswer && isWrongAnswerPage)
            ? "На главную"
            : "Следующий вопрос"}
        </Button>
      )}
    </Stack>
  );
};
