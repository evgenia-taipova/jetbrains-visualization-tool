"use client";

import { useState } from "react";

interface CategoryListProps {
  categories: Record<string, string[]>;
  counts: Record<string, number>;
  onSelect: (category?: string, subcategory?: string) => void;
}

export function CategoryList({
  categories,
  counts,
  onSelect,
}: CategoryListProps) {
  const [selected, setSelected] = useState<{
    category?: string;
    subcategory?: string;
  }>({});

  const handleSelect = (category?: string, subcategory?: string) => {
    setSelected({ category, subcategory });
    onSelect(category, subcategory);
  };
  return (
    <div className="p-4 flex flex-col gap-2 w-64 border-r ">
      <h2
        onClick={() => handleSelect(undefined, undefined)}
        className={`cursor-pointer ${!selected.category ? "font-bold text-blue-500" : ""}`}
      >
        All Categories
      </h2>

      {Object.entries(categories).map(([main, subs]) => (
        <div key={main}>
          <h2
            onClick={() => handleSelect(main)}
            className={`cursor-pointer ${
              selected.category === main && !selected.subcategory
                ? "font-bold text-blue-500"
                : ""
            }`}
          >
            {main} ({counts[main] || 0})
          </h2>
          {subs.length > 0 && (
            <ul className="ml-4">
              {subs.map((sub) => (
                <li
                  key={sub}
                  onClick={() => handleSelect(main, sub)}
                  className={`cursor-pointer ${
                    selected.category === main && selected.subcategory === sub
                      ? "font-bold text-blue-500"
                      : ""
                  }`}
                >
                  {sub} ({counts[`${main}: ${sub}`] || 0})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
