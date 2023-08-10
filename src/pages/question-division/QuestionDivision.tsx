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
        if ((index + 1) % QUESTIONS_PER_GROUP === 0) {
          const startIndex = index + 1 - QUESTIONS_PER_GROUP + 1;

          return (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemButton onClick={() => onStartTesting(startIndex - 1)}>
                  От {startIndex} до {index + 1}
                </ListItemButton>
              </ListItem>

              <Divider />
            </React.Fragment>
          );
        }

        return null;
      })}
    </List>
  );
};
