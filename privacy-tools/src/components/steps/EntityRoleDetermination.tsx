import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { TREE_NODES, ROOT_NODE } from './entity-role-tree.ts';
import type { QuestionNode, OutcomeNode } from './entity-role-tree.ts';
import type { OrgProfile } from '@core/data/types.js';

interface EntityRoleDeterminationProps {
  onDetermine: (entityType: OrgProfile['entityType']) => void;
  onDismiss: () => void;
  onStepComplete?: (entry: { question: string; answer: 'Yes' | 'No' }) => void;
}

export function EntityRoleDetermination({ onDetermine, onDismiss, onStepComplete }: EntityRoleDeterminationProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(ROOT_NODE);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = TREE_NODES[currentNodeId];
  if (!currentNode) return null;

  function navigate(nextId: string, answer: 'Yes' | 'No') {
    if (onStepComplete && currentNode.kind === 'question') {
      const q = currentNode as QuestionNode;
      onStepComplete({ question: q.question, answer });
    }
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  }

  function handleBack() {
    const prev = [...history];
    const last = prev.pop();
    if (last) {
      setHistory(prev);
      setCurrentNodeId(last);
    }
  }

  function handleRestart() {
    setHistory([]);
    setCurrentNodeId(ROOT_NODE);
  }

  if (currentNode.kind === 'outcome') {
    const outcome = currentNode as OutcomeNode;
    return (
      <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{outcome.label}</span>
        </div>
        <p className="text-xs text-muted-foreground">{outcome.explanation}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDetermine(outcome.entityType)}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Use this role
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
          >
            <RotateCcw className="h-3 w-3" />
            Start over
          </button>
        </div>
      </div>
    );
  }

  const question = currentNode as QuestionNode;
  const questionNumber = history.length + 1;

  return (
    <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Question {questionNumber}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <p className="text-sm font-medium">{question.question}</p>
      <p className="text-xs text-muted-foreground">{question.helpText}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(question.yes, 'Yes')}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary hover:bg-accent/50"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => navigate(question.no, 'No')}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary hover:bg-accent/50"
        >
          No
        </button>
      </div>

      {history.length > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="text-xs text-primary hover:underline"
        >
          Back to previous question
        </button>
      )}
    </div>
  );
}
