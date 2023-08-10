import React from "react";
import { useData } from "../../hooks/useData";
import { Divider, List, ListItem, ListItemButton } from "@mui/material";
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

          return (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemButton onClick={() => onStartTesting(startIndex)}>
                  От {startIndex + 1} до {index + 1}
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
