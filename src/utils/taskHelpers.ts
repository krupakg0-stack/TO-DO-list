import { SortOption, StatusFilter, Task, TaskPriority } from '../types/task';

export const STORAGE_KEY = 'taskflow_mvp_tasks_v1';
export const NAME_KEY = 'taskflow_mvp_username_v1';

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftIsoDate(baseIso: string, days: number): string {
  const [y, m, d] = baseIso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

export function getDefaultTasks(todayIso: string = getTodayIso()): Task[] {
  return [
    {
      id: 't-101',
      title: 'Calculus Problem Set 4',
      description: 'Complete sections 3.2 and 3.4, check integration bounds, and upload PDF.',
      category: 'Education',
      priority: 'High',
      dueDate: todayIso,
      createdAt: shiftIsoDate(todayIso, -4),
      completed: false,
    },
    {
      id: 't-102',
      title: 'UX Research Sync Slides',
      description: 'Summarize 5 student usability interviews and highlight top 3 navigation findings.',
      category: 'Work',
      priority: 'High',
      dueDate: shiftIsoDate(todayIso, -2),
      createdAt: shiftIsoDate(todayIso, -6),
      completed: false,
    },
    {
      id: 't-103',
      title: 'Read Cognitive Psych Ch. 6',
      description: 'Annotate memory retrieval section ahead of Thursday seminar.',
      category: 'Education',
      priority: 'Medium',
      dueDate: shiftIsoDate(todayIso, 2),
      createdAt: shiftIsoDate(todayIso, -3),
      completed: false,
    },
    {
      id: 't-104',
      title: 'Renew Library Books',
      description: 'Extend loan for Design of Everyday Things and Algorithms.',
      category: 'Personal',
      priority: 'Low',
      dueDate: todayIso,
      createdAt: shiftIsoDate(todayIso, -1),
      completed: true,
    },
    {
      id: 't-105',
      title: 'Weekly Meal Prep & Groceries',
      description: 'Pick up oats, spinach, roasted chickpeas, and coffee beans.',
      category: 'Personal',
      priority: 'Medium',
      dueDate: shiftIsoDate(todayIso, 3),
      createdAt: shiftIsoDate(todayIso, -2),
      completed: false,
    },
    {
      id: 't-106',
      title: 'Portfolio Case Study Update',
      description: 'Export final responsive frames and write reflection on user testing.',
      category: 'Work',
      priority: 'Medium',
      dueDate: shiftIsoDate(todayIso, -3),
      createdAt: shiftIsoDate(todayIso, -7),
      completed: true,
    },
    {
      id: 't-107',
      title: 'Book Dentist Checkup',
      description: 'Call clinic before 4 PM to confirm December slot.',
      category: 'Other',
      priority: 'Low',
      dueDate: shiftIsoDate(todayIso, 5),
      createdAt: todayIso,
      completed: false,
    },
  ];
}

export function loadTasks(todayIso: string = getTodayIso()): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to defaults if storage is unavailable or corrupted
  }
  return getDefaultTasks(todayIso);
}

export function persistTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadUserName(): string {
  try {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // Fallback to default name
  }
  return 'Maya';
}

export function persistUserName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    // Ignore storage quota errors
  }
}

export function formatHeaderDate(todayIso: string = getTodayIso()): string {
  const parts = todayIso.split('-');
  if (parts.length !== 3) return todayIso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateLabel(iso: string): string {
  if (!iso) return 'No due date';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDateLabel(iso: string): string {
  if (!iso) return 'No date';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isTaskOverdue(task: Task, todayIso: string): boolean {
  return !task.completed && Boolean(task.dueDate) && task.dueDate < todayIso;
}

export function filterAndSortTasks(
  tasks: Task[],
  options: {
    searchQuery: string;
    categoryFilter: string;
    priorityFilter: string;
    statusFilter: StatusFilter;
    sortBy: SortOption;
    todayIso: string;
  }
): Task[] {
  const {
    searchQuery,
    categoryFilter,
    priorityFilter,
    statusFilter,
    sortBy,
    todayIso,
  } = options;
  const q = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q)) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    if (statusFilter === 'today') return t.dueDate === todayIso;
    if (statusFilter === 'upcoming') {
      return Boolean(t.dueDate && t.dueDate > todayIso && !t.completed);
    }
    if (statusFilter === 'completed') return t.completed;
    if (statusFilter === 'pending') return !t.completed;
    if (statusFilter === 'overdue') return isTaskOverdue(t, todayIso);
    return true;
  });

  const priorityWeight: Record<TaskPriority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...filtered].sort((a, b) => {
    if (sortBy === 'due-asc') {
      return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
    }
    if (sortBy === 'due-desc') {
      return (b.dueDate || '0000-01-01').localeCompare(a.dueDate || '0000-01-01');
    }
    if (sortBy === 'priority-desc') {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    }
    if (sortBy === 'created-desc') {
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    }
    return 0;
  });
}
