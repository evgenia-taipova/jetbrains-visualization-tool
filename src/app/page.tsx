"use client";

import { useState, useMemo } from "react";
import { CategoryList } from "../components/CategoryList";
import { CategoryDistribution } from "../components/CategoryDistribution";
import { QuestionList } from "../components/QuestionList";
import { DifficultyDistribution } from "../components/DifficultyDistribution";
import { Loader } from "../components/ui/Loader";
import { ErrorDisplay } from "../components/ui/ErrorDisplay";
import { useFilteredQuestions } from "../hooks/useFilteredQuestions";
import { useTriviaQuestions } from "../hooks/useTriviaQuestions";
import { calculateMetrics } from "../utils/metrics";

export default function Home() {
  const [selected, setSelected] = useState<{
    category?: string;
    subcategory?: string;
  }>({});

  const { questions, error, isLoading } = useTriviaQuestions();
  const filteredQuestions = useFilteredQuestions(questions, selected);

  const {
    categoryMap,
    counts,
    categoryDistribution,
    difficultyDistribution,
    totalFilteredQuestions,
    selectedText,
  } = useMemo(() => {
    return calculateMetrics(questions, filteredQuestions, selected);
  }, [questions, filteredQuestions, selected]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="flex">
      <CategoryList
        categories={categoryMap}
        counts={counts}
        onSelect={(category, subcategory) =>
          setSelected({ category, subcategory })
        }
      />

      <div className="p-8 w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Mini Vizualization App for Trivia Questions
        </h1>
        <div className="p-4 mb-4 border rounded bg-gray-50 text-center">
          <p>
            <strong>Selected Category:</strong> {selectedText}
          </p>
          <p>
            <strong>Total Questions:</strong> {totalFilteredQuestions}
          </p>
        </div>
        <div className="flex gap-8 mb-8 items-center">
          {categoryDistribution.length > 0 && (
            <CategoryDistribution categoryDistribution={categoryDistribution} />
          )}
          <DifficultyDistribution data={difficultyDistribution} />
        </div>
        <QuestionList questions={filteredQuestions} />
      </div>
    </div>
  );
}
