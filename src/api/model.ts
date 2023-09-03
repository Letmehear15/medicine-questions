import { IStatistic } from "../context/QuestionProvider";

export interface AppSettings {
    lastOpenQuestion: number;
    statistic: IStatistic[]
    wrongAnswers: number[]
}