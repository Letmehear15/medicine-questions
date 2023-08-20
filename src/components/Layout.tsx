import React, { useMemo } from "react";

import { Main } from "../pages/main/Main";
import { QuestionPage } from "../pages/question/QuestionPage";
import { EPaths, useRedirect } from "../context/RedirectProvider";
import { ArrowBack } from "./ArrowBack";
import { WrongAnswers } from "../pages/wrong-answers/WrongAnswers";
import { Box, Typography, useTheme } from "@mui/material";
import { QuestionDivision } from "../pages/question-division/QuestionDivision";
import { Statistic } from "../pages/statistic";

export const Layout = () => {
  const { path } = useRedirect();
  const { palette } = useTheme();

  const render = useMemo(() => {
    switch (path) {
      case EPaths.MAIN:
        return <Main />;
      case EPaths.QUESTION:
        return <QuestionPage />;
      case EPaths.QUESTION_DIVISION:
        return <QuestionDivision />;
      case EPaths.WRONG_ANSWERS:
        return <WrongAnswers />;
      case EPaths.STATISTIC:
        return <Statistic />;
      default:
        return <Main />;
    }
  }, [path]);

  return (
    <>
      <Box
        mb={3}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {path !== EPaths.MAIN && <ArrowBack />}

        {path === EPaths.WRONG_ANSWERS && (
          <Typography
            fontSize={13}
            fontWeight="bold"
            color={palette.error.main}
          >
            Неверные ответы
          </Typography>
        )}
      </Box>
      {render}
    </>
  );
};
