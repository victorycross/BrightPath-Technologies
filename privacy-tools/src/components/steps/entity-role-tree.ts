import type { OrgProfile } from '@core/data/types.js';

type EntityType = OrgProfile['entityType'];

export interface QuestionNode {
  kind: 'question';
  id: string;
  question: string;
  helpText: string;
  yes: string;
  no: string;
}

export interface OutcomeNode {
  kind: 'outcome';
  id: string;
  entityType: EntityType;
  label: string;
  explanation: string;
}

export type TreeNode = QuestionNode | OutcomeNode;

export const TREE_NODES: Record<string, TreeNode> = {
  q1: {
    kind: 'question',
    id: 'q1',
    question: 'Does your organization determine why personal data is collected?',
    helpText:
      'You decide the purposes of processing — e.g., you chose to collect emails for marketing, or payment details for billing.',
    yes: 'q2',
    no: 'q3',
  },
  q2: {
    kind: 'question',
    id: 'q2',
    question: 'Does your organization determine how personal data is processed?',
    helpText:
      'You decide the means of processing — e.g., which systems store the data, what security measures apply, how long data is retained.',
    yes: 'q3a',
    no: 'outcome_joint',
  },
  q3: {
    kind: 'question',
    id: 'q3',
    question:
      'Does another organization instruct you on what personal data to collect and how to process it?',
    helpText:
      'Another organization defines the purposes and provides instructions — e.g., a client tells you to process their customer records according to their specifications.',
    yes: 'outcome_processor',
    no: 'q4',
  },
  q3a: {
    kind: 'question',
    id: 'q3a',
    question:
      'Do you share these decisions about purposes and means with another organization?',
    helpText:
      'You and another organization jointly decide why and how data is processed — e.g., co-managing a loyalty program with a partner.',
    yes: 'outcome_joint',
    no: 'outcome_controller',
  },
  q4: {
    kind: 'question',
    id: 'q4',
    question:
      'Do you share decision-making about data processing purposes with another organization?',
    helpText:
      "Even though you don't fully determine purposes alone, you may co-determine them with a partner organization.",
    yes: 'outcome_joint',
    no: 'outcome_processor',
  },
  outcome_controller: {
    kind: 'outcome',
    id: 'outcome_controller',
    entityType: 'controller',
    label: 'Data Controller',
    explanation:
      'Your organization independently determines the purposes and means of processing personal data. You bear primary accountability for compliance with privacy regulations.',
  },
  outcome_processor: {
    kind: 'outcome',
    id: 'outcome_processor',
    entityType: 'processor',
    label: 'Data Processor',
    explanation:
      "Your organization processes personal data on behalf of, and under the instructions of, another organization (the controller). You must follow the controller's instructions and have a data processing agreement in place.",
  },
  outcome_joint: {
    kind: 'outcome',
    id: 'outcome_joint',
    entityType: 'joint_controller',
    label: 'Joint Controller',
    explanation:
      'Your organization jointly determines the purposes and/or means of processing with one or more other organizations. A joint controller arrangement under GDPR Art. 26 (or equivalent) should be documented.',
  },
};

export const ROOT_NODE = 'q1';
