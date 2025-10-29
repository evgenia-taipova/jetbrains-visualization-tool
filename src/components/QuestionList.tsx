import { Question } from "../app/types";

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <ul>
      {questions.map((q, idx) => (
        <li key={`${q.category}-${idx}`}>
          <strong>{q.category}:</strong> {q.question} <em>({q.difficulty})</em>
        </li>
      ))}
    </ul>
  );
}
