import { Divider, List, ListItem, Stack, Typography } from "@mui/material";
import React from "react";
import {
  LocalstorageItems,
  useLocalstorage,
} from "../../hooks/useLocalstorage";
import { IStatistic } from "../../context/QuestionProvider";

export const Statistic = () => {
  const { getFromLocalstorage } = useLocalstorage();

  const statisticDates: IStatistic[] = getFromLocalstorage(
    LocalstorageItems.statistic
  );

  return (
    <List sx={{ minHeight: "100vh" }}>
      {statisticDates.map(
        (
          {
            countOfWrongAnswers,
            date,
            selectedQuestionBlock,
            questionsInBlock,
          },
          index
        ) => {
          return (
            <React.Fragment key={index}>
              <ListItem>
                <Stack>
                  <Typography>Дата: {date}</Typography>
                  <Typography>
                    Верных ответов:{" "}
                    {((questionsInBlock - countOfWrongAnswers) /
                      questionsInBlock) *
                      100}
                    %
                  </Typography>
                  <Typography>Номер блока: {selectedQuestionBlock}</Typography>
                </Stack>
              </ListItem>

              <Divider />
            </React.Fragment>
          );
        }
      )}
    </List>
  );
};
