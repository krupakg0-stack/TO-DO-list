import React, { useEffect, useRef } from 'react';
import { NavSection } from '../types/task';

interface NavCounts {
  all: number;
  today: number;
  upcoming: number;
  completed: number;
}

interface SidebarProps {
  activeNav: NavSection;
  counts: NavCounts;
  onSelectNav: (nav: NavSection) => void;
  mobileDrawerOpen: boolean;
  onOpenMobileDrawer: () => void;
  onCloseMobileDrawer: () => void;
  onOpenAddModal: () => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: string; countKey?: keyof NavCounts }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'all', label: 'My Tasks', icon: 'task_alt', countKey: 'all' },
  { id: 'today', label: 'Today', icon: 'today', countKey: 'today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'event_upcoming', countKey: 'upcoming' },
  { id: 'completed', label: 'Completed', icon: 'done_all', countKey: 'completed' },
  { id: 'categories', label: 'Categories', icon: 'category' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export const DesktopSidebar: React.FC<Pick<SidebarProps, 'activeNav' | 'counts' | 'onSelectNav'>> = ({
  activeNav,
  counts,
  onSelectNav,
}) => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 min-h-screen bg-light-surface-container-lowest border-r border-light-outline-variant p-gutter-lg justify-between">
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center gap-gutter-sm px-2">
          <div className="w-9 h-9 rounded-md bg-light-primary flex items-center justify-center text-light-on-primary shadow-sm shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-headline-md text-light-on-surface leading-none">
              TaskFlow
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Smart Workspace
            </span>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isSelected = activeNav === item.id;
            const count = item.countKey ? counts[item.countKey] : undefined;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectNav(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded text-left transition-colors duration-state-change ease-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary ${
                  isSelected
                    ? 'bg-light-primary-container text-light-on-primary-container'
                    : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
                }`}
              >
                <span className="flex items-center gap-gutter-sm">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-label text-label-lg whitespace-nowrap shrink-0">
                    {item.label}
                  </span>
                </span>
                {typeof count === 'number' && (
                  <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-light-surface-container-low text-light-on-surface-variant tabular-nums">
                    <span className="font-label text-label-sm">{count}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="rounded-md bg-light-surface-container-low p-gutter-md flex flex-col gap-gutter-xs border border-light-outline-variant">
        <span className="font-label text-label-md text-light-on-surface">Daily Focus</span>
        <p className="font-body text-label-sm text-light-on-surface-variant text-balance">
          Tackle High priority tasks first to keep overdue items at zero.
        </p>
      </div>
    </aside>
  );
};

export const MobileHeaderAndDrawer: React.FC<
  Pick<
    SidebarProps,
    | 'activeNav'
    | 'counts'
    | 'onSelectNav'
    | 'mobileDrawerOpen'
    | 'onOpenMobileDrawer'
    | 'onCloseMobileDrawer'
    | 'onOpenAddModal'
  >
> = ({
  activeNav,
  counts,
  onSelectNav,
  mobileDrawerOpen,
  onOpenMobileDrawer,
  onCloseMobileDrawer,
  onOpenAddModal,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileDrawerOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [mobileDrawerOpen]);

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-gutter-md py-3 bg-light-surface-container-lowest border-b border-light-outline-variant sticky top-0 z-20">
        <div className="flex items-center gap-gutter-sm">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Open navigation menu"
            className="inline-flex items-center justify-center w-9 h-9 rounded text-light-on-surface hover:bg-light-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              menu
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-light-primary flex items-center justify-center text-light-on-primary">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span className="font-headline text-title-lg text-light-on-surface whitespace-nowrap">
              TaskFlow
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-light-primary text-light-on-primary shadow-sm hover:bg-brand-indigo transition-colors duration-state-change whitespace-nowrap shrink-0"
        >
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">
            add
          </span>
          <span className="font-label text-label-md">Add Task</span>
        </button>
      </header>

      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-drawer-title"
        onCancel={(e) => {
          e.preventDefault();
          onCloseMobileDrawer();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            onCloseMobileDrawer();
          }
        }}
        className="m-0 h-full max-h-screen w-72 bg-light-surface-container-lowest text-light-on-surface border-r border-light-outline-variant shadow-xl p-gutter-md"
      >
        <header className="flex items-center justify-between pb-gutter-md border-b border-light-outline-variant">
          <h2 id="mobile-drawer-title" className="font-headline text-headline-md text-light-on-surface">
            TaskFlow
          </h2>
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            aria-label="Close navigation menu"
            className="inline-flex items-center justify-center w-8 h-8 rounded text-light-on-surface-variant hover:bg-light-surface-container-low"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              close
            </span>
          </button>
        </header>
        <nav className="pt-gutter-md flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isSelected = activeNav === item.id;
            const count = item.countKey ? counts[item.countKey] : undefined;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectNav(item.id);
                  onCloseMobileDrawer();
                }}
                className={`flex items-center justify-between gap-gutter-sm px-3 py-2.5 rounded text-left transition-colors duration-state-change ${
                  isSelected
                    ? 'bg-light-primary-container text-light-on-primary-container'
                    : 'text-light-on-surface-variant hover:bg-light-surface-container-low'
                }`}
              >
                <span className="flex items-center gap-gutter-sm">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="font-label text-label-lg whitespace-nowrap">{item.label}</span>
                </span>
                {typeof count === 'number' && (
                  <span className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 rounded-full bg-light-surface-container-low text-light-on-surface-variant tabular-nums">
                    <span className="font-label text-label-sm">{count}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </dialog>
    </>
  );
};
