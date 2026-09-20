import { TkaSubject } from './tkaTypes';
import { MATEMATIKA_LESSONS } from './lessons/matematikaLessons';
import { IPA_LESSONS } from './lessons/ipaLessons';
import { BINDO_LESSONS } from './lessons/bindoLessons';
import { BING_LESSONS } from './lessons/bingLessons';

export interface TkaMateriLesson {
  id: string;
  subject: TkaSubject;
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  overview: string;
  keyPoints: {
    title: string;
    description: string;
    formulaOrConcept?: string;
  }[];
  exampleProblems: {
    question: string;
    stepByStep: string[];
    theKingTip: string;
    answer: string;
  }[];
  summary: string;
}

export const TKA_DETAILED_LESSONS: TkaMateriLesson[] = [
  ...MATEMATIKA_LESSONS,
  ...IPA_LESSONS,
  ...BINDO_LESSONS,
  ...BING_LESSONS,
];
