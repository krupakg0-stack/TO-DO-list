import React from 'react';
import { CATEGORIES, Task, TaskCategory } from '../types/task';

interface CategoriesViewProps {
  tasks: Task[];
  onSelectCategory: (category: TaskCategory) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ tasks, onSelectCategory }) => {
  return (
    <section className="flex flex-col gap-gutter-md" aria-label="Categories overview">
      <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
        <h2 className="font-headline text-headline-md text-light-on-surface">Task Categories</h2>
        <p className="font-body text-body-md text-light-on-surface-variant">
          Select any category to filter your task list.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
        {CATEGORIES.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat.name);
          const pending = catTasks.filter((t) => !t.completed).length;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className="text-left bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm hover:border-light-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary transition-colors duration-state-change flex flex-col justify-between gap-gutter-md"
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-10 h-10 rounded bg-light-primary-container text-light-on-primary-container inline-flex items-center justify-center">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    {cat.icon}
                  </span>
                </span>
                <span className="font-label text-label-sm text-light-primary tabular-nums">
                  {pending} pending
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-title text-title-md text-light-on-surface">{cat.name}</h3>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
