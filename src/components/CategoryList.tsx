"use client";

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
  return (
    <div className="p-4">
      <h2 onClick={() => onSelect(undefined)}>All Categories</h2>

      {Object.entries(categories).map(([main, subs]) => (
        <div key={main}>
          <h2 onClick={() => onSelect(main)}>
            {main}({counts[main] || 0})
          </h2>
          {subs.length > 0 && (
            <ul className="ml-4">
              {subs.map((sub) => (
                <li key={sub} onClick={() => onSelect(main, sub)}>
                  {sub}({counts[`${main}: ${sub}`] || 0})
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
