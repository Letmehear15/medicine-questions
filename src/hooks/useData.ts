import { IQuestion } from '../context/QuestionProvider'
import questions from '../data/questions.json'

export const useData = (): IQuestion[] => questions.questions