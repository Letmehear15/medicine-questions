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
  const { onStartTesting } = useQuestion();
  const { onChangePath } = useRedirect();

  const hasLastOpenQuestion = getFromLocalstorage(
    LocalstorageItems.lastOpenQuestion
  );

  const shouldShowContinueButton =
    hasLastOpenQuestion && Number(hasLastOpenQuestion) > 0;

  const onRedirect = () => {
    onChangePath(EPaths.QUESTION);
  };

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
          onClick={onRedirect}
        >
          Продолжить
        </Button>
      )}
      <Button
        onClick={onStartTesting}
        size="large"
        variant="contained"
        endIcon={<span>&#128021;</span>}
      >
        Начать тестирование
      </Button>
      <Button size="large" variant="contained" endIcon={<span>&#128061;</span>}>
        Неправильные вопросы
      </Button>
      <Button size="large" variant="contained" endIcon={<span>&#128065;</span>}>
        Статистика
      </Button>
    </Stack>
  );
};
