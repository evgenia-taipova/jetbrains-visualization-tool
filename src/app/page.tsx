"use client";

import { useState } from "react";
import { CategoryList } from "../components/CategoryList";
import { CategoryDistribution } from "../components/CategoryDistribution";
import { QuestionList } from "../components/QuestionList";
import { DifficultyDistribution } from "../components/DifficultyDistribution";
import { useFilteredQuestions } from "../hooks/useFilteredQuestions";
import { useTriviaQuestions } from "../hooks/useTriviaQuestions";

function parseCategory(category: string) {
  const [main, sub] = category.split(":").map((s) => s.trim());
  return { main, sub };
}

export default function Home() {
  const [selected, setSelected] = useState<{
    category?: string;
    subcategory?: string;
  }>({});

  const { questions, error, isLoading } = useTriviaQuestions();

  const filteredQuestions = useFilteredQuestions(questions, selected);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">Loading questions...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-red-600">
          Error fetching questions
        </h1>
        <p className="text-gray-400">{error}</p>
        <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
          >
            Try again
          </button>
      </div>
    );
  }

  const categoryMap: Record<string, string[]> = {};
  questions.forEach((q) => {
    const { main, sub } = parseCategory(q.category);
    categoryMap[main] = categoryMap[main] ?? [];
    if (sub && !categoryMap[main].includes(sub)) {
      categoryMap[main].push(sub);
    }
  });

  let categoryDistribution: { name: string; value: number }[] = [];
  if (!selected.category) {
    categoryDistribution = Object.keys(categoryMap).map((category) => ({
      name: category,
      value: questions.filter((q) => q.category.startsWith(category)).length,
    }));
  } else if (selected.subcategory) {
    const fullCategory = `${selected.category}: ${selected.subcategory}`;
    const count = questions.filter((q) => q.category === fullCategory).length;
    categoryDistribution = [{ name: fullCategory, value: count }];
  } else {
    const subcategories = categoryMap[selected.category] || [];
    if (subcategories.length > 0) {
      categoryDistribution = subcategories.map((sub) => ({
        name: sub,
        value: questions.filter(
          (q) => q.category === `${selected.category}: ${sub}`
        ).length,
      }));
    } else {
      const count = questions.filter(
        (q) => parseCategory(q.category).main === selected.category
      ).length;
      categoryDistribution = [{ name: selected.category, value: count }];
    }
  }

  const counts: Record<string, number> = {};
  questions.forEach((q) => {
    const { main, sub } = parseCategory(q.category);
    if (sub) counts[`${main}: ${sub}`] = (counts[`${main}: ${sub}`] || 0) + 1;
    counts[main] = (counts[main] || 0) + 1;
  });

  const difficultyCounts: Record<string, number> = {};
  filteredQuestions.forEach((q) => {
    difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
  });
  const difficultyDistribution = Object.entries(difficultyCounts).map(
    ([name, value]) => ({ name, value })
  );

  const totalFilteredQuestions = filteredQuestions.length;

  const selectedText = selected.subcategory
    ? `${selected.category}: ${selected.subcategory}`
    : selected.category || "All categories";

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
