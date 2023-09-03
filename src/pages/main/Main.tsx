import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useQuestion } from "../../context/QuestionProvider";
import { EPaths, useRedirect } from "../../context/RedirectProvider";

export const Main = () => {
  const { wrongAnswerIndexes, currentQuestionIndex, statistic } = useQuestion();
  const { onChangePath } = useRedirect();

  const shouldShowContinueButton = Boolean(
    currentQuestionIndex && Number(currentQuestionIndex) > 0
  );

  return (
    <Stack gap={5} sx={{ height: "100vh" }}>
      <Typography mb={5} variant="h3" textAlign="center">
        Для Мимимилки
      </Typography>
      {shouldShowContinueButton && (
        <Button
          size="large"
          variant="outlined"
          endIcon={<span>&#128044;</span>}
          onClick={() => onChangePath(EPaths.QUESTION)}
        >
          Продолжить
        </Button>
      )}
      <Button
        onClick={() => onChangePath(EPaths.QUESTION_DIVISION)}
        size="large"
        variant="contained"
        endIcon={<span>&#128021;</span>}
      >
        Начать тестирование
      </Button>
      <Button
        onClick={() => onChangePath(EPaths.WRONG_ANSWERS)}
        size="large"
        variant="contained"
        endIcon={<span>&#128061;</span>}
        disabled={wrongAnswerIndexes.length === 0}
      >
        Неверные ответы
      </Button>
      <Button
        onClick={() => onChangePath(EPaths.STATISTIC)}
        size="large"
        disabled={statistic.length === 0}
        variant="contained"
        endIcon={<span>&#128065;</span>}
      >
        Статистика
      </Button>
    </Stack>
  );
};
