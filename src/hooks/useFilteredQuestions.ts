import { useMemo } from "react";
import { Question } from "../app/types";
import { parseCategory } from "../utils/metrics";

interface SelectedCategory {
  category?: string;
  subcategory?: string;
}

export function useFilteredQuestions(
  questions: Question[],
  selected: SelectedCategory,
): Question[] {
  return useMemo(() => {
    const { category, subcategory } = selected;

    if (!category) {
      return questions;
    }

    return questions.filter((q) => {
      const { main } = parseCategory(q.category);

      if (subcategory) {
        return q.category === `${category}: ${subcategory}`;
      }

      return main === category;
    });
  }, [questions, selected]);
}
