import React from "react";
import Paper from "@mui/material/Paper";
import { Layout } from "./components/Layout";
import { Container } from "@mui/material";
import { useScrollUp } from "./hooks/useScrollUp";

export const App = () => {
  useScrollUp();

  return (
    <Paper
      sx={{
        pt: 3,
      }}
    >
      <Container>
        <Layout />
      </Container>
    </Paper>
  );
};
