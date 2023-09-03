import React from "react";
import loading from "../../assets/loading.png";
import { Box } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        img: {
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": {
              transform: "rotate(360deg)",
            },
            "100%": {
              transform: "rotate(0deg)",
            },
          },
        },
      }}
    >
      <img src={loading} alt="loading" />
    </Box>
  );
};
