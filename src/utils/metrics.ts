import { Question } from "../app/types";

interface SelectedCategory {
  category?: string;
  subcategory?: string;
}

type Distribution = { name: string; value: number }[];
type CategoryMap = Record<string, string[]>;

export function calculateMetrics(
  questions: Question[],
  filteredQuestions: Question[],
  selected: SelectedCategory
) {
  const categoryMap: CategoryMap = {};
  const counts: Record<string, number> = {};

  questions.forEach((q) => {
    const { main, sub } = parseCategory(q.category);

    if (!categoryMap[main]) {
      categoryMap[main] = [];
      }

    if (sub && !categoryMap[main].includes(sub)) {
      categoryMap[main].push(sub);
    }

    if (sub) {
      counts[`${main}: ${sub}`] = (counts[`${main}: ${sub}`] || 0) + 1;
    } 

    counts[main] = (counts[main] || 0) + 1;
  });

  let categoryDistribution: Distribution = [];
  const { category, subcategory } = selected;

  if (subcategory && category) {
    categoryDistribution = getSpecificSubcategoryDistribution(
      questions,
      category,
      subcategory
    );
  } else if (category) {
    categoryDistribution = getSubcategoryDistribution(
      questions,
      category,
      categoryMap[category] || []
    );
  } else {
    categoryDistribution = getMainCategoryDistribution(questions, categoryMap);
  }

  const difficultyCounts: Record<string, number> = {};
  filteredQuestions.forEach((q) => {
    if (difficultyCounts[q.difficulty]) {
      difficultyCounts[q.difficulty]++;
    } else {
      difficultyCounts[q.difficulty] = 1;
    }
  });

  const difficultyDistribution = Object.entries(difficultyCounts).map(
    ([name, value]) => ({ name, value })
  );

  const totalFilteredQuestions = filteredQuestions.length;
  const selectedText = selected.subcategory
    ? `${selected.category}: ${selected.subcategory}`
    : selected.category || "All categories";

  return {
    categoryMap,
    counts,
    categoryDistribution,
    difficultyDistribution,
    totalFilteredQuestions,
    selectedText,
  };
}

function parseCategory(category: string) {
  const [main, sub] = category.split(":").map((s) => s.trim());

  return { main, sub };
}

function getMainCategoryDistribution(
  questions: Question[],
  categoryMap: CategoryMap
): Distribution {
  return Object.keys(categoryMap).map((category) => ({
    name: category,
    value: questions.filter((q) => q.category.startsWith(category)).length,
  }));
}

function getSubcategoryDistribution(
  questions: Question[],
  category: string,
  subcategories: string[]
): Distribution {
  if (subcategories.length > 0) {
    return subcategories.map((sub) => ({
      name: sub,
      value: questions.filter(
        (q) => q.category === `${category}: ${sub}`
      ).length,
    }));
  } else {
    const count = questions.filter(
      (q) => parseCategory(q.category).main === category
    ).length;

    return [{ name: category, value: count }];
  }
}

function getSpecificSubcategoryDistribution(
  questions: Question[],
  category: string,
  subcategory: string
): Distribution {
  const fullCategory = `${category}: ${subcategory}`;
  const count = questions.filter((q) => q.category === fullCategory).length;

  return [{ name: fullCategory, value: count }];
}