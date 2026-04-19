export type Mcq = {
  question: string;
  options: [string, string, string, string];
  answer: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examTip: string;
};

export type DescriptiveQuestion = {
  question: string;
  marks: number;
  modelAnswer: string;
  answerTips: string;
  timeAllocation: string;
};

export type RevisionPackage = {
  topicSummary: string;
  examRelevance: string;
  revisionNotes: string;
  mcqs: Mcq[];
  descriptiveQuestions: DescriptiveQuestion[];
  commonMistakes: string[];
  answerWritingApproach: string;
  howTopicIsTested: string;
  keyFocusAreas: string;
  quickRevisionPointers: string[];
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