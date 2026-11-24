export type TaskCategory = 'Education' | 'Personal' | 'Work' | 'Other';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type NavSection =
  | 'dashboard'
  | 'all'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'categories'
  | 'settings';
export type StatusFilter = 'all' | 'today' | 'upcoming' | 'pending' | 'completed' | 'overdue';
export type SortOption = 'due-asc' | 'due-desc' | 'priority-desc' | 'created-desc';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  completed: boolean;
}

export interface ToastState {
  message: string;
  isError: boolean;
}

export interface CategoryInfo {
  name: TaskCategory;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Education',
    icon: 'school',
    description: 'Assignments, lectures, exams, and study blocks.',
  },
  {
    name: 'Work',
    icon: 'work',
    description: 'Meetings, project deliverables, and client syncs.',
  },
  {
    name: 'Personal',
    icon: 'person',
    description: 'Errands, health, finances, and daily routines.',
  },
  {
    name: 'Other',
    icon: 'folder',
    description: 'Miscellaneous tasks and reminders.',
  },
];
