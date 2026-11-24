import React from 'react';
import { NavSection, Task } from '../types/task';
import { formatShortDateLabel, isTaskOverdue } from '../utils/taskHelpers';

interface DashboardStatsProps {
  tasks: Task[];
  todayIso: string;
  onOpenDetail: (taskId: string) => void;
  onQuickNav: (target: NavSection | 'recent') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  tasks,
  todayIso,
  onOpenDetail,
  onQuickNav,
}) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = tasks.filter((t) => isTaskOverdue(t, todayIso)).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const todayItems = tasks.filter((t) => t.dueDate === todayIso && !t.completed).slice(0, 3);
  const upcomingItems = tasks
    .filter((t) => Boolean(t.dueDate) && t.dueDate > todayIso && !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);
  const recentItems = [...tasks]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 3);

  return (
    <>
      <section
        aria-label="Task summary statistics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-md items-stretch"
      >
        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm">
          <header className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-label-lg text-light-on-surface-variant">Total Tasks</h2>
            <span className="w-8 h-8 rounded bg-light-primary-container text-light-on-primary-container inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                assignment
              </span>
            </span>
          </header>
          <div className="flex items-center justify-between gap-gutter-sm">
            <p className="font-headline text-headline-lg text-light-on-surface tabular-nums">
              {total}
            </p>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              All active &amp; done
            </span>
          </div>
        </article>

        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm">
          <header className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-label-lg text-light-on-surface-variant">
              Completed Tasks
            </h2>
            <span className="w-8 h-8 rounded bg-success-container text-on-success-container inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                check_circle
              </span>
            </span>
          </header>
          <div className="flex items-center justify-between gap-gutter-sm">
            <p className="font-headline text-headline-lg text-success tabular-nums">{completed}</p>
            <span className="font-label text-label-sm text-light-on-surface-variant">Finished</span>
          </div>
        </article>

        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm">
          <header className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-label-lg text-light-on-surface-variant">
              Pending Tasks
            </h2>
            <span className="w-8 h-8 rounded bg-warning-container text-on-warning-container inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                pending_actions
              </span>
            </span>
          </header>
          <div className="flex items-center justify-between gap-gutter-sm">
            <p className="font-headline text-headline-lg text-warning tabular-nums">{pending}</p>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              In progress
            </span>
          </div>
        </article>

        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm">
          <header className="flex items-center justify-between gap-gutter-sm">
            <h2 className="font-title text-label-lg text-light-on-surface-variant">
              Overdue Tasks
            </h2>
            <span className="w-8 h-8 rounded bg-danger-container text-on-danger-container inline-flex items-center justify-center">
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                warning
              </span>
            </span>
          </header>
          <div className="flex items-center justify-between gap-gutter-sm">
            <p className="font-headline text-headline-lg text-danger tabular-nums">{overdue}</p>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Needs attention
            </span>
          </div>
        </article>
      </section>

      <section
        aria-label="Task completion progress"
        className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-title text-title-md text-light-on-surface">
              Overall Completion Progress
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
              {completed} of {total} tasks completed
            </p>
          </div>
          <span className="font-headline text-headline-md text-light-primary tabular-nums">
            {pct}%
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full bg-light-surface-container-low overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-light-primary transition-all duration-surface-enter ease-surface-enter"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>

      <section
        aria-label="Dashboard task highlights"
        className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-md items-stretch"
      >
        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-md">
          <div className="flex flex-col gap-gutter-sm">
            <header className="flex items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-xs">
                <span
                  className="material-symbols-outlined text-light-primary text-title-lg"
                  aria-hidden="true"
                >
                  today
                </span>
                <h2 className="font-title text-title-md text-light-on-surface">
                  Today&apos;s Tasks
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onQuickNav('today')}
                className="font-label text-label-md text-light-primary hover:underline whitespace-nowrap shrink-0"
              >
                View all
              </button>
            </header>
            <div className="flex flex-col gap-gutter-xs">
              {todayItems.length === 0 ? (
                <p className="font-body text-body-md text-light-on-surface-variant py-2">
                  No pending tasks due today.
                </p>
              ) : (
                todayItems.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onOpenDetail(task.id)}
                    className="w-full text-left px-3 py-2 rounded bg-light-surface hover:bg-light-surface-container-low border border-light-outline-variant flex items-center justify-between gap-gutter-sm transition-colors duration-state-change"
                  >
                    <span className="font-body text-body-md text-light-on-surface truncate">
                      {task.title}
                    </span>
                    <span className="font-label text-label-sm text-light-on-surface-variant shrink-0 tabular-nums">
                      {formatShortDateLabel(task.dueDate)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </article>

        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-md">
          <div className="flex flex-col gap-gutter-sm">
            <header className="flex items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-xs">
                <span
                  className="material-symbols-outlined text-warning text-title-lg"
                  aria-hidden="true"
                >
                  event_upcoming
                </span>
                <h2 className="font-title text-title-md text-light-on-surface">
                  Upcoming Deadlines
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onQuickNav('upcoming')}
                className="font-label text-label-md text-light-primary hover:underline whitespace-nowrap shrink-0"
              >
                View all
              </button>
            </header>
            <div className="flex flex-col gap-gutter-xs">
              {upcomingItems.length === 0 ? (
                <p className="font-body text-body-md text-light-on-surface-variant py-2">
                  No upcoming deadlines.
                </p>
              ) : (
                upcomingItems.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onOpenDetail(task.id)}
                    className="w-full text-left px-3 py-2 rounded bg-light-surface hover:bg-light-surface-container-low border border-light-outline-variant flex items-center justify-between gap-gutter-sm transition-colors duration-state-change"
                  >
                    <span className="font-body text-body-md text-light-on-surface truncate">
                      {task.title}
                    </span>
                    <span className="font-label text-label-sm text-light-on-surface-variant shrink-0 tabular-nums">
                      Due {formatShortDateLabel(task.dueDate)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </article>

        <article className="h-full bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-md">
          <div className="flex flex-col gap-gutter-sm">
            <header className="flex items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-xs">
                <span
                  className="material-symbols-outlined text-success text-title-lg"
                  aria-hidden="true"
                >
                  history
                </span>
                <h2 className="font-title text-title-md text-light-on-surface">Recent Tasks</h2>
              </div>
              <button
                type="button"
                onClick={() => onQuickNav('recent')}
                className="font-label text-label-md text-light-primary hover:underline whitespace-nowrap shrink-0"
              >
                View all
              </button>
            </header>
            <div className="flex flex-col gap-gutter-xs">
              {recentItems.length === 0 ? (
                <p className="font-body text-body-md text-light-on-surface-variant py-2">
                  No recent tasks yet.
                </p>
              ) : (
                recentItems.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onOpenDetail(task.id)}
                    className="w-full text-left px-3 py-2 rounded bg-light-surface hover:bg-light-surface-container-low border border-light-outline-variant flex items-center justify-between gap-gutter-sm transition-colors duration-state-change"
                  >
                    <span className="font-body text-body-md text-light-on-surface truncate">
                      {task.title}
                    </span>
                    <span className="font-label text-label-sm text-light-on-surface-variant shrink-0 tabular-nums">
                      {formatShortDateLabel(task.dueDate)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </article>
      </section>
    </>
  );
};
