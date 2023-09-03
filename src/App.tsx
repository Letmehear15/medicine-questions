import React, { useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Layout } from "./components/Layout";
import { Container } from "@mui/material";
import { useScrollUp } from "./hooks/useScrollUp";
import { putData } from "./api/api";

export const App = () => {
  useScrollUp();

  useEffect(() => {
    (async () => {
      const statisticLC = localStorage.getItem("statistic");
      const lastOpenQuestionLC = localStorage.getItem("last-open-question");
      const wrongAnswersLC = localStorage.getItem("wrong-answers");

      if (statisticLC && lastOpenQuestionLC && wrongAnswersLC) {
        const statistic = JSON.parse(statisticLC);
        const lastOpenQuestion = JSON.parse(lastOpenQuestionLC);
        const wrongAnswers = JSON.parse(wrongAnswersLC);

        await putData({ lastOpenQuestion, statistic, wrongAnswers });
      }
    })();
  }, []);

  return (
    <Paper
      sx={{
        pt: 3,
      }}
    >
      <Container>{/* <Layout /> */}</Container>
    </Paper>
  );
};
