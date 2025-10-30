import { useMemo } from "react";
import { Question } from "../app/types";

function parseCategory(category: string) {
  const [main, sub] = category.split(":").map((s) => s.trim());
  return { main, sub };
}

interface SelectedCategory {
  category?: string;
  subcategory?: string;
}

export function useFilteredQuestions(
  questions: Question[],
  selected: SelectedCategory
) {
  return useMemo(() => {
    const { category, subcategory } = selected;

    if (!category) return questions;

    return questions.filter((q) => {
      const { main } = parseCategory(q.category);
      if (subcategory) return q.category === `${category}: ${subcategory}`;
      return main === category;
    });
  }, [questions, selected]);
}
