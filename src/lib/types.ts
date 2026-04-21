export type ExamRelevance = {
  frequency: string;
  typicalMarks: string;
  lastAppeared: string;
  prediction: string;
  paperAndPart: string;
};

export type RevisionNotes = {
  coreConcept: string;
  mustKnowDefinition: string;
  recognitionCriteria: string[];
  measurementRule: string;
  workedExample: string;
  keyExceptions: string[];
  examinerFavouritePoints: string[];
};

export type Mcq = {
  scenario: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  whyCorrect: string;
  whyOthersWrong: string;
  difficulty: "Easy" | "Medium" | "Hard";
  thisTestsYourUnderstandingOf: string;
};

export type DescriptiveQuestion = {
  exactQuestion: string;
  marks: number;
  timeToSpend: string;
  openingLineToWrite: string;
  modelAnswer: string;
  markingSchemeHints: string;
  bonusPoint: string;
};

export type CommonMistake = {
  mistake: string;
  whyItHappens: string;
  correction: string;
  marksLost: string;
};

export type AnswerWritingApproach = {
  openingFormula: string;
  structureToFollow: string;
  whatCheckerLooksFor: string;
  timeAllocation: string;
  presentationTips: string;
};

export type HowTopicIsTested = {
  pastPaperPattern: string;
  angleAlwaysTaken: string;
  neverAsked: string;
  trickInQuestion: string;
};

export type KeyFocusAreas = {
  highYield: string[] | string;
  ifOnly2DaysLeft: string;
  linkToOtherTopics: string;
  numericalVsTheory: string;
};

export type RevisionPackage = {
  personalNote: string;
  examRelevance: ExamRelevance;
  revisionNotes: RevisionNotes;
  mcqs: Mcq[];
  descriptiveQuestions: DescriptiveQuestion[];
  commonMistakes: CommonMistake[];
  answerWritingApproach: AnswerWritingApproach;
  howTopicIsTested: HowTopicIsTested;
  keyFocusAreas: KeyFocusAreas;
  quickRevisionPointers: string[];
  formulaSheet: string;
  lastMinuteTips: string[];
};

export type RevisionRecord = {
  id: string;
  user_id: string;
  topic: string;
  source_text: string | null;
  package_json: RevisionPackage;
  created_at: string;
  is_revised: boolean;
};

export type GenerateResponse = {
  revisionId: string;
  data: RevisionPackage;
  topic: string;
};