import React from "react";
import { EPaths, useRedirect } from "../../context/RedirectProvider";
import { Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useQuestion } from "../../context/QuestionProvider";

export const ArrowBack = () => {
  const { onChangePath } = useRedirect();
  const { setIsLoading } = useQuestion();

  const onRedirect = () => {
    setIsLoading(true);
    onChangePath(EPaths.MAIN);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ width: "fit-content", cursor: "pointer" }}
      onClick={onRedirect}
    >
      <ArrowBackIosIcon />
      <Typography>На главную</Typography>
    </Box>
  );
};
