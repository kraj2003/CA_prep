// types.ts

export interface ExamRelevance {
  paperAndPart: string;
  frequency: string;
  typicalMarks: string;
  lastAppeared: string;
  prediction: string;
}

export interface RevisionNotes {
  coreConcept: string;
  mustKnowDefinition: string;
  recognitionCriteria: string[];
  measurementRule: string;
  workedExample: string;
  keyExceptions: string[];
  examinerFavouritePoints: string[];
}

export interface MCQ {
  scenario: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  // new
  correctAnswerExplanation: string;
  wrongAnswerTrap: string;
  // legacy (generation-form uses these)
  whyCorrect: string;
  whyOthersWrong: string;
  difficulty: "Easy" | "Medium" | "Hard";
  conceptTested: string;
  // legacy
  thisTestsYourUnderstandingOf: string;
}

export interface DescriptiveQuestion {
  // new
  question: string;
  marks: number;
  suggestedTime: string;
  openingLine: string;
  modelAnswer: string;
  markingBreakdown: string;
  bonusPoint: string;
  // legacy (generation-form uses these)
  exactQuestion: string;
  timeToSpend: string;
  openingLineToWrite: string;
  markingSchemeHints: string;
}

export interface CommonMistake {
  // new
  wrongAnswer: string;
  whyStudentsWriteThis: string;
  correctAnswer: string;
  standardReference: string;
  marksImpact: string;
  // legacy (generation-form uses these)
  mistake: string;
  whyItHappens: string;
  correction: string;
  marksLost: string;
}

export interface AnswerWritingApproach {
  // new
  openingTemplate: string;
  structure: string[];
  checkerLooksFor: string[];
  timeBreakdown: string;
  presentationFormat: string;
  // legacy (generation-form uses these)
  openingFormula: string;
  structureToFollow: string;
  whatCheckerLooksFor: string;
  timeAllocation: string;
  presentationTips: string;
}

export interface HowTopicIsTested {
  // new
  examPattern: string[];
  icaiAngle: string;
  neverTested: string;
  questionTrick: string;
  // legacy (generation-form uses these)
  pastPaperPattern: string;
  angleAlwaysTaken: string;
  neverAsked: string;
  trickInQuestion: string;
}

export interface KeyFocusAreas {
  // new
  highYieldAreas: string[];
  ifOnly2DaysLeft: string;
  linkedTopics: string;
  numericalVsTheory: string;
  // legacy (generation-form uses these)
  highYield: string[] | string;
  linkToOtherTopics: string;
}

export interface FormulaItem {
  name: string;
  formula: string;
  variables: string;
  example: string;
}

export interface FormulaSheet {
  formulas: FormulaItem[];
  keyRates: string[];
  mnemonics: string[];
}

export interface RevisionPackage {
  personalNote?: string; // kept — generation-form ResultHeader uses this
  examRelevance: ExamRelevance;
  revisionNotes: RevisionNotes;
  mcqs: MCQ[];
  descriptiveQuestions: DescriptiveQuestion[];
  commonMistakes: CommonMistake[];
  answerWritingApproach: AnswerWritingApproach;
  howTopicIsTested: HowTopicIsTested;
  keyFocusAreas: KeyFocusAreas;
  quickRevisionPointers: string[];
  formulaSheet: FormulaSheet;
  lastMinuteTips: string[];
}

export interface GenerateResponse {
  topic: string;
  revisionId?: string;
  data: RevisionPackage;
}