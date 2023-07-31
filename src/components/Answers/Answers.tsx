import React, { FC, useLayoutEffect, useMemo, useState } from "react";
import { IAnswers, useQuestion } from "../../context/QuestionProvider";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { EPaths, useRedirect } from "../../context/RedirectProvider";
import { shuffleArray } from "../../utils/utils";

interface IAnswersProps {
  answers: IAnswers[];
  setWasChecked: (value: boolean) => void;
  wasChecked: boolean;
}

export const Answers: FC<IAnswersProps> = ({
  answers,
  setWasChecked,
  wasChecked,
}) => {
  const [checked, setChecked] = useState<number[]>([]);
  const { onAddWrongAnswer, removeWrongAnswer } = useQuestion();
  const { path } = useRedirect();

  const { palette } = useTheme();

  const isWrongAnswerPage = path === EPaths.WRONG_ANSWERS;

  useLayoutEffect(() => {
    setChecked([]);
  }, [answers]);

  const rightAnswers = answers
    .map((answer, index) => (answer.isCorrect ? index : -1))
    .filter((index) => index !== -1);

  const wasRightAnswer =
    rightAnswers.length === checked.length &&
    rightAnswers.every((answer) => checked.includes(answer));

  const onCheckAnswers = () => {
    setWasChecked(true);

    if (!isWrongAnswerPage && !wasRightAnswer) {
      onAddWrongAnswer();
      return;
    }

    if (isWrongAnswerPage && wasRightAnswer) {
      removeWrongAnswer();
    }
  };

  const onCheckChange = (index: number) => {
    if (!checked.includes(index)) {
      setChecked([...checked, index]);
      return;
    }

    const filteredChecked = checked.filter((check) => check !== index);

    setChecked(filteredChecked);
  };

  const stylesAfterCheck = (isCorrect: boolean) =>
    wasChecked
      ? {
          borderBottom: `2px solid ${
            isCorrect ? palette.success.main : palette.error.main
          }`,
          p: 0.5,
        }
      : {};

  const shuffledAnswers = useMemo(() => {
    return shuffleArray(answers);
  }, [answers]);

  return (
    <Stack>
      {wasChecked && (
        <Typography
          color={wasRightAnswer ? palette.success.main : palette.error.main}
        >
          {wasRightAnswer ? "Умничка!" : "Все равно умничка!"}
        </Typography>
      )}
      <FormGroup>
        {shuffledAnswers.map(({ text, isCorrect }, index) => (
          <FormControlLabel
            sx={{ mb: 3 }}
            key={index}
            control={<Checkbox sx={{ mr: 1 }} />}
            label={
              <Typography sx={stylesAfterCheck(isCorrect)}>{text}</Typography>
            }
            checked={checked.includes(index)}
            onChange={() => onCheckChange(index)}
            disabled={wasChecked}
          />
        ))}
      </FormGroup>

      {!wasChecked && (
        <Button
          disabled={checked.length === 0}
          variant="outlined"
          color="warning"
          onClick={onCheckAnswers}
        >
          Проверить
        </Button>
      )}
    </Stack>
  );
};
