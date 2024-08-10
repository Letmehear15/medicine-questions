import React from "react";
import { useData } from "../../hooks/useData";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuestion } from "../../context/QuestionProvider";

export const QUESTIONS_PER_GROUP = 100;

export const QuestionDivision = () => {
  const questions = useData();
  const { onStartTesting } = useQuestion();

  return (
    <List>
      {questions.map((_, index) => {
        if (
          (index + 1) % QUESTIONS_PER_GROUP === 0 ||
          index === questions.length - 1
        ) {
          const startIndex = index - (index % QUESTIONS_PER_GROUP);
          const endIndex = index + 1;
          const blockNumber = Number(Math.ceil(endIndex / QUESTIONS_PER_GROUP));

          return (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemButton onClick={() => onStartTesting(startIndex)}>
                  <Stack>
                    <Typography variant="h6" mb={1}>
                      Блок {blockNumber}
                    </Typography>
                    От {startIndex + 1} до {endIndex}
                  </Stack>
                </ListItemButton>
              </ListItem>
              {index !== questions.length - 1 && <Divider />}
            </React.Fragment>
          );
        }

        return null;
      })}
    </List>
  );
};
