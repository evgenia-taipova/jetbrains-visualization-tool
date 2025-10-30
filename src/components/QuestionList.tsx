import { useState } from "react";
import { Question } from "../app/types";

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  const toggleAnswer = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }

      return newSet;
    });
  };

  return (
    <ul>
      {questions.map((q, idx) => {
        const questionId = `${q.category}-${q.question}-${q.difficulty}-${idx}`;
        return (
          <li key={questionId} className="mb-4">
            <div
              onClick={() => toggleAnswer(questionId)}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
            >
              <strong>{q.category}:</strong> {q.question}{" "}
              <em>({q.difficulty})</em>
            </div>
            {selectedQuestions.has(questionId) && (
              <div className="mt-2 p-3 bg-green-50 rounded">
                <strong className="text-green-700">Answer:</strong>{" "}
                <span className="text-green-900">{q.correctAnswer}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
