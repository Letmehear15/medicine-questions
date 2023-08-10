import React from "react";
import Paper from "@mui/material/Paper";
import { Layout } from "./components/Layout";
import { Container } from "@mui/material";

export const App = () => {
  return (
    <Paper
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "scroll",
        pt: 3,
      }}
    >
      <Container>
        <Layout />
      </Container>
    </Paper>
  );
};
