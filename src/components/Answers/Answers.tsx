import React, { FC, useLayoutEffect, useState } from "react";
import { IAnswers } from "../../context/QuestionProvider";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

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

  const { palette } = useTheme();

  useLayoutEffect(() => {
    setChecked([]);
  }, [answers]);

  const onCheckAnswers = () => {
    setWasChecked(true);
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

  return (
    <Stack>
      <FormGroup>
        {answers.map(({ text, isCorrect }, index) => (
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
