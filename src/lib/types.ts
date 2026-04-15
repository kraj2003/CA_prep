export type Mcq = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
};

export type DescriptiveQuestion = {
  question: string;
  modelAnswer: string;
};

export type RevisionPackage = {
  revisionNotes: string[];
  mcqs: Mcq[];
  descriptiveQuestions: DescriptiveQuestion[];
  commonMistakes: string[];
  answerWritingApproach: string[];
  howTopicIsTested: string[];
  keyFocusAreas: string[];
  quickRevisionPointers: string[];
};

export type RevisionRecord = {
  id: string;
  user_id: string;
  topic: string;
  source_text: string | null;
  package_json: RevisionPackage;
  created_at: string;
};
