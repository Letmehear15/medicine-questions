import React from "react";
import { EPaths, useRedirect } from "../../context/RedirectProvider";
import { Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const ArrowBack = () => {
  const { onChangePath } = useRedirect();

  const onRedirect = () => {
    onChangePath(EPaths.MAIN);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      mb={3}
      sx={{ width: "fit-content", cursor: "pointer" }}
      onClick={onRedirect}
    >
      <ArrowBackIosIcon />
      <Typography>На главную</Typography>
    </Box>
  );
};
