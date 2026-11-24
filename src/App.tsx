/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CategoriesView } from './components/CategoriesView';
import { DashboardStats } from './components/DashboardStats';
import { FilterBar } from './components/FilterBar';
import { DeleteConfirmModal, TaskDetailModal, TaskFormModal } from './components/Modals';
import { SettingsView } from './components/SettingsView';
import { DesktopSidebar, MobileHeaderAndDrawer } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import {
  NavSection,
  SortOption,
  StatusFilter,
  Task,
  TaskCategory,
  TaskPriority,
  ToastState,
} from './types/task';
import {
  filterAndSortTasks,
  formatHeaderDate,
  getDefaultTasks,
  getTodayIso,
  loadTasks,
  loadUserName,
  persistTasks,
  persistUserName,
} from './utils/taskHelpers';

export default function App() {
  const todayIso = useMemo(() => getTodayIso(), []);
  const headerDateLabel = useMemo(() => formatHeaderDate(todayIso), [todayIso]);

  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(todayIso));
  const [userName, setUserName] = useState<string>(() => loadUserName());
  const [activeNav, setActiveNav] = useState<NavSection>('dashboard');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('due-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    persistTasks(tasks);
  }, [tasks]);

  const navCounts = useMemo(() => {
    const all = tasks.length;
    const today = tasks.filter((t) => t.dueDate === todayIso && !t.completed).length;
    const upcoming = tasks.filter(
      (t) => Boolean(t.dueDate) && t.dueDate > todayIso && !t.completed
    ).length;
    const completed = tasks.filter((t) => t.completed).length;
    return { all, today, upcoming, completed };
  }, [tasks, todayIso]);

  const visibleTasks = useMemo(
    () =>
      filterAndSortTasks(tasks, {
        searchQuery,
        categoryFilter,
        priorityFilter,
        statusFilter,
        sortBy,
        todayIso,
      }),
    [tasks, searchQuery, categoryFilter, priorityFilter, statusFilter, sortBy, todayIso]
  );

  const editingTask = useMemo(
    () => (editingTaskId ? tasks.find((t) => t.id === editingTaskId) ?? null : null),
    [tasks, editingTaskId]
  );

  const detailTask = useMemo(
    () => (detailTaskId ? tasks.find((t) => t.id === detailTaskId) ?? null : null),
    [tasks, detailTaskId]
  );

  const pendingDeleteTask = useMemo(
    () => (pendingDeleteId ? tasks.find((t) => t.id === pendingDeleteId) ?? null : null),
    [tasks, pendingDeleteId]
  );

  const handleNavSelect = (target: NavSection) => {
    setActiveNav(target);
    if (target === 'dashboard' || target === 'all') setStatusFilter('all');
    if (target === 'today') setStatusFilter('today');
    if (target === 'upcoming') setStatusFilter('upcoming');
    if (target === 'completed') setStatusFilter('completed');
  };

  const handleQuickNav = (target: NavSection | 'recent') => {
    if (target === 'recent') {
      setActiveNav('all');
      setStatusFilter('all');
      setSortBy('created-desc');
    } else {
      handleNavSelect(target);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  const handleOpenAddModal = () => {
    setEditingTaskId(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (taskId: string) => {
    setDetailTaskId(null);
    setEditingTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (data: {
    id?: string;
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate: string;
    completed: boolean;
  }) => {
    if (data.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === data.id
            ? {
                ...t,
                title: data.title,
                description: data.description,
                category: data.category,
                priority: data.priority,
                dueDate: data.dueDate,
                completed: data.completed,
              }
            : t
        )
      );
      setIsTaskModalOpen(false);
      setEditingTaskId(null);
      showToast('Task updated successfully.');
    } else {
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate,
        createdAt: todayIso,
        completed: data.completed,
      };
      setTasks((prev) => [newTask, ...prev]);
      setIsTaskModalOpen(false);
      setEditingTaskId(null);
      showToast('New task added to your list.');
    }
  };

  const handleToggleTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const nextCompleted = !target.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextCompleted } : t))
    );
    showToast(
      nextCompleted ? 'Task marked as completed.' : 'Task moved back to pending.'
    );
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    setTasks((prev) => prev.filter((t) => t.id !== pendingDeleteId));
    if (detailTaskId === pendingDeleteId) {
      setDetailTaskId(null);
    }
    setPendingDeleteId(null);
    showToast('Task deleted.');
  };

  const handleSelectCategory = (category: TaskCategory) => {
    setCategoryFilter(category);
    setActiveNav('all');
    setStatusFilter('all');
  };

  const handleSaveName = (rawName: string) => {
    const trimmed = rawName.trim();
    if (!trimmed) {
      showToast('Display name cannot be empty.', true);
      return;
    }
    setUserName(trimmed);
    persistUserName(trimmed);
    showToast('Preferences saved.');
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(
      completedCount > 0
        ? `Cleared ${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'}.`
        : 'No completed tasks to clear.'
    );
  };

  const handleResetDemo = () => {
    setTasks(getDefaultTasks(todayIso));
    showToast('Sample tasks restored.');
  };

  const isMainView = activeNav !== 'categories' && activeNav !== 'settings';
  const showDashboardSummary = activeNav === 'dashboard';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <DesktopSidebar
        activeNav={activeNav}
        counts={navCounts}
        onSelectNav={handleNavSelect}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeaderAndDrawer
          activeNav={activeNav}
          counts={navCounts}
          onSelectNav={handleNavSelect}
          mobileDrawerOpen={mobileDrawerOpen}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
          onOpenAddModal={handleOpenAddModal}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-gutter-md sm:px-gutter-lg lg:px-gutter-xl pt-gutter-lg lg:pt-gutter-xl pb-24 flex flex-col gap-gutter-lg">
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-gutter-md">
            <div className="flex flex-col gap-gutter-xs">
              <h1 className="font-headline text-display-lg-mobile lg:text-display-lg text-light-on-surface text-balance">
                Good morning, {userName}
              </h1>
              <p className="font-body text-body-lg text-light-on-surface-variant tabular-nums">
                {headerDateLabel}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-gutter-sm">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded bg-light-primary text-light-on-primary shadow-sm hover:bg-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-primary focus-visible:ring-offset-2 transition-colors duration-state-change ease-state-change whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  add
                </span>
                <span className="font-label text-label-lg">Add Task</span>
              </button>
            </div>
          </section>

          {isMainView && (
            <div className="flex flex-col gap-gutter-lg">
              {showDashboardSummary && (
                <DashboardStats
                  tasks={tasks}
                  todayIso={todayIso}
                  onOpenDetail={(id) => setDetailTaskId(id)}
                  onQuickNav={handleQuickNav}
                />
              )}

              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                visibleCount={visibleTasks.length}
              />

              <TaskList
                tasks={visibleTasks}
                todayIso={todayIso}
                onToggle={handleToggleTask}
                onDetails={(id) => setDetailTaskId(id)}
                onEdit={handleOpenEditModal}
                onDelete={(id) => setPendingDeleteId(id)}
                onResetFilters={handleResetFilters}
                onAddTask={handleOpenAddModal}
              />
            </div>
          )}

          {activeNav === 'categories' && (
            <CategoriesView tasks={tasks} onSelectCategory={handleSelectCategory} />
          )}

          {activeNav === 'settings' && (
            <SettingsView
              userName={userName}
              onSaveName={handleSaveName}
              onClearCompleted={handleClearCompleted}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        editingTask={editingTask}
        todayIso={todayIso}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
        onSave={handleSaveTask}
        onValidationError={(msg) => showToast(msg, true)}
      />

      <TaskDetailModal
        task={detailTask}
        todayIso={todayIso}
        onClose={() => setDetailTaskId(null)}
        onToggle={handleToggleTask}
        onEdit={handleOpenEditModal}
      />

      <DeleteConfirmModal
        task={pendingDeleteTask}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      <Toast toast={toast} />
    </div>
  );
}
