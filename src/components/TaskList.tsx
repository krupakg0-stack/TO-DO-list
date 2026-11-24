import React from 'react';
import { Task } from '../types/task';
import { formatDateLabel, isTaskOverdue } from '../utils/taskHelpers';
import { PriorityBadge, StatusBadge } from './Badges';

interface TaskListProps {
  tasks: Task[];
  todayIso: string;
  onToggle: (taskId: string) => void;
  onDetails: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onResetFilters: () => void;
  onAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  todayIso,
  onToggle,
  onDetails,
  onEdit,
  onDelete,
  onResetFilters,
  onAddTask,
}) => {
  return (
    <section aria-label="Task list" className="flex flex-col gap-gutter-sm">
      <div className="flex flex-col gap-gutter-sm">
        {tasks.length === 0 ? (
          <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-xl text-center flex flex-col items-center gap-gutter-sm">
            <span
              className="material-symbols-outlined text-display-lg text-light-on-surface-variant"
              aria-hidden="true"
            >
              task_alt
            </span>
            <h3 className="font-title text-title-md text-light-on-surface">
              No tasks match this view
            </h3>
            <p className="font-body text-body-md text-light-on-surface-variant max-w-prose">
              Try adjusting your search or filters, or add a new task to stay on track.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-gutter-sm pt-gutter-xs">
              <button
                type="button"
                onClick={onResetFilters}
                className="px-gutter-md py-2 rounded bg-light-surface-container-low text-light-on-surface hover:bg-light-surface-container transition-colors duration-state-change"
              >
                <span className="font-label text-label-lg">Clear Filters</span>
              </button>
              <button
                type="button"
                onClick={onAddTask}
                className="px-gutter-md py-2 rounded bg-light-primary text-light-on-primary hover:bg-brand-indigo transition-colors duration-state-change"
              >
                <span className="font-label text-label-lg">Add Task</span>
              </button>
            </div>
          </div>
        ) : (
          tasks.map((task) => {
            const overdue = isTaskOverdue(task, todayIso);
            const checkIcon = task.completed ? 'check_circle' : 'radio_button_unchecked';
            const checkColor = task.completed
              ? 'text-success'
              : 'text-light-on-surface-variant hover:text-light-primary';
            const titleClass = task.completed
              ? 'font-title text-title-md text-light-on-surface-variant line-through'
              : 'font-title text-title-md text-light-on-surface';

            return (
              <article
                key={task.id}
                className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-md shadow-sm flex flex-col gap-gutter-sm hover:border-light-surface-container-high transition-colors duration-state-change ease-state-change"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-gutter-sm sm:gap-gutter-md">
                  <div className="flex items-start gap-gutter-sm min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggle(task.id)}
                      aria-label={
                        task.completed ? 'Mark task as pending' : 'Mark task as completed'
                      }
                      className={`mt-0.5 shrink-0 inline-flex items-center justify-center rounded-full ${checkColor} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary`}
                    >
                      <span
                        className="material-symbols-outlined text-headline-md"
                        style={
                          task.completed ? { fontVariationSettings: "'FILL' 1" } : undefined
                        }
                        aria-hidden="true"
                      >
                        {checkIcon}
                      </span>
                    </button>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onDetails(task.id)}
                        className="text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary rounded"
                      >
                        <h3 className={`${titleClass} text-pretty`}>{task.title}</h3>
                      </button>
                      {task.description && (
                        <p className="font-body text-body-md text-light-on-surface-variant text-pretty max-w-prose">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-gutter-xs shrink-0 flex-wrap pl-8 sm:pl-0">
                    <StatusBadge task={task} todayIso={todayIso} />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container whitespace-nowrap shrink-0">
                      <span className="font-label text-label-md">{task.category}</span>
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-gutter-sm pt-gutter-xs border-t border-light-outline-variant pl-8">
                  <div className="flex flex-wrap items-center gap-gutter-md">
                    {overdue ? (
                      <span className="inline-flex items-center gap-1 font-label text-label-sm text-danger tabular-nums">
                        <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                          schedule
                        </span>
                        Overdue · {formatDateLabel(task.dueDate)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-label text-label-sm text-light-on-surface-variant tabular-nums">
                        <span className="material-symbols-outlined text-body-md" aria-hidden="true">
                          event
                        </span>
                        Due {formatDateLabel(task.dueDate)}
                      </span>
                    )}
                    <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                      Created {formatDateLabel(task.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-gutter-xs">
                    <button
                      type="button"
                      onClick={() => onDetails(task.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface transition-colors duration-state-change whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-body-lg" aria-hidden="true">
                        visibility
                      </span>
                      <span className="font-label text-label-md">Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(task.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface transition-colors duration-state-change whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-body-lg" aria-hidden="true">
                        edit
                      </span>
                      <span className="font-label text-label-md">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-danger hover:bg-danger-container transition-colors duration-state-change whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-body-lg" aria-hidden="true">
                        delete
                      </span>
                      <span className="font-label text-label-md">Delete</span>
                    </button>
                  </div>
                </footer>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
