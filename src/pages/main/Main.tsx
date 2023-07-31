import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import {
  LocalstorageItems,
  useLocalstorage,
} from "../../hooks/useLocalstorage";
import { useQuestion } from "../../context/QuestionProvider";
import { EPaths, useRedirect } from "../../context/RedirectProvider";

export const Main = () => {
  const { getFromLocalstorage } = useLocalstorage();
  const { wrongAnswerIndexes } = useQuestion();
  const { onChangePath } = useRedirect();

  const hasLastOpenQuestion = getFromLocalstorage(
    LocalstorageItems.lastOpenQuestion
  );

  const shouldShowContinueButton =
    hasLastOpenQuestion && Number(hasLastOpenQuestion) > 0;

  return (
    <Stack gap={5}>
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
        disabled
        size="large"
        variant="contained"
        endIcon={<span>&#128065;</span>}
      >
        Статистика
      </Button>
    </Stack>
  );
};
