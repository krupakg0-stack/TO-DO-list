import React from 'react';
import { SortOption, StatusFilter } from '../types/task';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  visibleCount: number;
}

const STATUS_CHIPS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusFilterChange,
  visibleCount,
}) => {
  return (
    <section
      aria-label="Search and filter tasks"
      className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-md shadow-sm flex flex-col gap-gutter-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-sm items-center">
        <div className="md:col-span-5">
          <label className="flex flex-col">
            <span className="sr-only font-label text-label-md">Search tasks by title</span>
            <div className="relative flex items-center">
              <span
                className="material-symbols-outlined absolute left-3 text-light-on-surface-variant text-title-lg pointer-events-none"
                aria-hidden="true"
              >
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tasks by title..."
                className="w-full rounded border border-light-outline-variant bg-light-surface pl-10 pr-3 py-2 font-body text-body-md text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none transition-colors duration-state-change ease-state-change"
              />
            </div>
          </label>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="filter-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="filter-priority" className="sr-only">
            Filter by priority
          </label>
          <select
            id="filter-priority"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label htmlFor="sort-select" className="sr-only">
            Sort tasks
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
          >
            <option value="due-asc">Sort: Due Date (Earliest)</option>
            <option value="due-desc">Sort: Due Date (Latest)</option>
            <option value="priority-desc">Sort: Priority (High to Low)</option>
            <option value="created-desc">Sort: Newest Created</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-light-outline-variant">
        <div className="flex flex-wrap items-center gap-gutter-xs" role="tablist" aria-label="Task status filter">
          {STATUS_CHIPS.map((chip) => {
            const isSelected = statusFilter === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onStatusFilterChange(chip.value)}
                className={`px-3 py-1.5 rounded-full font-label text-label-md transition-colors duration-state-change ease-state-change whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container-low text-light-on-surface-variant hover:bg-light-surface-container'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
          Showing {visibleCount} {visibleCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>
    </section>
  );
};
