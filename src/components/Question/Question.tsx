import React, { useState } from "react";
import questions from "../../data/questions.json";
import { IQuestion, useQuestion } from "../../context/QuestionProvider";
import { Button, Stack, Typography } from "@mui/material";
import { useData } from "../../hooks/useData";
import { Answers } from "../Answers";

export const Question = () => {
  const { currentQuestionIndex, onLastOpenQuestionUpdate, isTheLastQuestion } =
    useQuestion();

  const { questionText, answers }: IQuestion =
    questions.questions[currentQuestionIndex];

  const questionLength = useData().length;
  const [wasChecked, setWasChecked] = useState(false);

  const onNextQuestion = () => {
    onLastOpenQuestionUpdate();
    setWasChecked(false);
  };

  return (
    <Stack gap={10}>
      <Typography textAlign="center">
        {currentQuestionIndex + 1}/{questionLength}
      </Typography>

      <Stack gap={3}>
        <Typography variant="h6">{questionText}</Typography>

        <Answers
          wasChecked={wasChecked}
          setWasChecked={setWasChecked}
          answers={answers}
        />
      </Stack>

      {wasChecked && (
        <Button variant="contained" onClick={onNextQuestion}>
          {isTheLastQuestion ? "На главную" : "Следующий вопрос"}
        </Button>
      )}
    </Stack>
  );
};
