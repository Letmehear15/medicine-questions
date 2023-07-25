import React, { useMemo } from "react";

import { Main } from "../pages/main/Main";
import { QuestionPage } from "../pages/question/QuestionPage";
import { EPaths, useRedirect } from "../context/RedirectProvider";
import { ArrowBack } from "./ArrowBack";

export const Layout = () => {
  const { path } = useRedirect();

  const render = useMemo(() => {
    switch (path) {
      case EPaths.MAIN:
        return <Main />;
      case EPaths.QUESTION:
        return <QuestionPage />;
      default:
        return <Main />;
    }
  }, [path]);

  return (
    <>
      {path !== EPaths.MAIN && <ArrowBack />}
      {render}
    </>
  );
};
