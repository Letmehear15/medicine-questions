import React, { FC, useLayoutEffect, useState } from "react";
import { IAnswers, useQuestion } from "../../context/QuestionProvider";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { EPaths, useRedirect } from "../../context/RedirectProvider";

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

  const isWrongAnswerPage = path === EPaths.WRONG_ANSWERS;

  useLayoutEffect(() => {
    setChecked([]);
  }, [answers]);

  const pointSummary = checked.every(
    (element) => answers[element] && answers[element]?.points !== 0
  )
    ? checked.reduce((acc, cur) => acc + answers[cur].points, 0)
    : 0;

  const wasRightAnswer = pointSummary === 100;

  const onCheckAnswers = () => {
    setWasChecked(true);

    if (!isWrongAnswerPage && !wasRightAnswer) {
      onAddWrongAnswer();
    }

    if (wasRightAnswer) {
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

  return (
    <Stack>
      {wasChecked && (
        <Typography
          color={wasRightAnswer ? "#47ffa7" : " tomato"}
          fontSize={20}
          mb={3}
        >
          Вы набрали: {pointSummary} баллов из 100
        </Typography>
      )}
      <FormGroup>
        {answers.map(({ text }, index) => (
          <FormControlLabel
            sx={{ mb: 3 }}
            key={index}
            control={<Checkbox sx={{ mr: 1 }} />}
            label={<Typography>{text}</Typography>}
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
