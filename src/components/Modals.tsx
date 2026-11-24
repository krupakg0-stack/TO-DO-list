import React, { useEffect, useRef, useState } from 'react';
import { Task, TaskCategory, TaskPriority } from '../types/task';
import { formatDateLabel } from '../utils/taskHelpers';
import { PriorityBadge, StatusBadge } from './Badges';

interface TaskFormModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  todayIso: string;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    description: string;
    category: TaskCategory;
    priority: TaskPriority;
    dueDate: string;
    completed: boolean;
  }) => void;
  onValidationError: (message: string) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  editingTask,
  todayIso,
  onClose,
  onSave,
  onValidationError,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Education');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(todayIso);
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setTitleError(false);
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setCategory(editingTask.category);
        setPriority(editingTask.priority);
        setDueDate(editingTask.dueDate || todayIso);
        setCompleted(editingTask.completed);
      } else {
        setTitle('');
        setDescription('');
        setCategory('Education');
        setPriority('Medium');
        setDueDate(todayIso);
        setCompleted(false);
      }
      if (!dialog.open) dialog.showModal();
      setTimeout(() => titleInputRef.current?.focus(), 0);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, editingTask, todayIso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      titleInputRef.current?.focus();
      onValidationError('Please enter a task title.');
      return;
    }

    onSave({
      id: editingTask?.id,
      title: trimmed,
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || todayIso,
      completed,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-desc"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="w-[calc(100%-2rem)] max-w-lg rounded-lg bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant shadow-xl p-0 m-auto"
    >
      <form onSubmit={handleSubmit} noValidate>
        <header className="flex items-start justify-between gap-gutter-md px-gutter-lg pt-gutter-lg pb-gutter-md border-b border-light-outline-variant">
          <div className="flex flex-col gap-gutter-xs">
            <h2 id="task-modal-title" className="font-title text-title-lg text-light-on-surface">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <p id="task-modal-desc" className="font-body text-body-md text-light-on-surface-variant">
              Fill in the task details below and save to your list.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex items-center justify-center w-8 h-8 rounded text-light-on-surface-variant hover:bg-light-surface-container-low"
          >
            <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
              close
            </span>
          </button>
        </header>

        <div className="px-gutter-lg py-gutter-md flex flex-col gap-gutter-md">
          <label className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface">
              Task title <span className="text-danger">*</span>
            </span>
            <input
              ref={titleInputRef}
              type="text"
              required
              aria-invalid={titleError ? 'true' : undefined}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError && e.target.value.trim()) setTitleError(false);
              }}
              placeholder="e.g., Complete Statistics Assignment 3"
              className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
            />
            {titleError && (
              <span role="alert" className="font-body text-label-sm text-danger">
                Task title is required. Please enter a title.
              </span>
            )}
          </label>

          <label className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface">
              Description (optional)
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes, links, or checklist details..."
              className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface placeholder:text-light-on-surface-variant focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
              >
                <option value="Education">Education</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">Due date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-gutter-xs">
              <span className="font-label text-label-md text-light-on-surface">Status</span>
              <select
                value={completed ? 'completed' : 'pending'}
                onChange={(e) => setCompleted(e.target.value === 'completed')}
                className="w-full rounded border border-light-outline-variant bg-light-surface-container-lowest px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-gutter-sm px-gutter-lg py-gutter-md border-t border-light-outline-variant bg-light-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="px-gutter-md py-2 rounded bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low transition-colors duration-state-change"
          >
            <span className="font-label text-label-lg">Cancel</span>
          </button>
          <button
            type="submit"
            className="px-gutter-md py-2 rounded bg-light-primary text-light-on-primary hover:bg-brand-indigo shadow-sm transition-colors duration-state-change"
          >
            <span className="font-label text-label-lg">Save Task</span>
          </button>
        </footer>
      </form>
    </dialog>
  );
};

interface TaskDetailModalProps {
  task: Task | null;
  todayIso: string;
  onClose: () => void;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  todayIso,
  onClose,
  onToggle,
  onEdit,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (task) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [task]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detail-modal-title"
      aria-describedby="detail-modal-desc"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="w-[calc(100%-2rem)] max-w-lg rounded-lg bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant shadow-xl p-0 m-auto"
    >
      {task && (
        <>
          <header className="flex items-start justify-between gap-gutter-md px-gutter-lg pt-gutter-lg pb-gutter-md border-b border-light-outline-variant">
            <div className="flex flex-col gap-gutter-xs min-w-0">
              <div className="flex flex-wrap items-center gap-gutter-xs">
                <StatusBadge task={task} todayIso={todayIso} />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-light-secondary-container text-light-on-secondary-container">
                  <span className="font-label text-label-md">{task.category}</span>
                </span>
                <PriorityBadge priority={task.priority} />
              </div>
              <h2
                id="detail-modal-title"
                className="font-title text-title-lg text-light-on-surface text-pretty"
              >
                {task.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="inline-flex items-center justify-center w-8 h-8 rounded text-light-on-surface-variant hover:bg-light-surface-container-low shrink-0"
            >
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                close
              </span>
            </button>
          </header>

          <div className="px-gutter-lg py-gutter-md flex flex-col gap-gutter-md">
            <p
              id="detail-modal-desc"
              className="font-body text-body-md text-light-on-surface-variant text-pretty"
            >
              {task.description || 'No description provided for this task.'}
            </p>
            <dl className="grid grid-cols-2 gap-gutter-md pt-gutter-sm border-t border-light-outline-variant">
              <div className="flex flex-col gap-0.5">
                <dt className="font-label text-label-sm text-light-on-surface-variant">Due Date</dt>
                <dd className="font-body text-body-md text-light-on-surface tabular-nums">
                  {formatDateLabel(task.dueDate)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-label text-label-sm text-light-on-surface-variant">Created</dt>
                <dd className="font-body text-body-md text-light-on-surface tabular-nums">
                  {formatDateLabel(task.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-gutter-sm px-gutter-lg py-gutter-md border-t border-light-outline-variant bg-light-surface-container-low">
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              className="px-gutter-md py-2 rounded bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low transition-colors duration-state-change"
            >
              <span className="font-label text-label-lg">
                {task.completed ? 'Mark Pending' : 'Mark Completed'}
              </span>
            </button>
            <div className="flex items-center gap-gutter-sm">
              <button
                type="button"
                onClick={() => onEdit(task.id)}
                className="px-gutter-md py-2 rounded bg-light-primary text-light-on-primary hover:bg-brand-indigo shadow-sm transition-colors duration-state-change"
              >
                <span className="font-label text-label-lg">Edit Task</span>
              </button>
            </div>
          </footer>
        </>
      )}
    </dialog>
  );
};

interface DeleteConfirmModalProps {
  task: Task | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (task) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [task]);

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-body"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="w-[calc(100%-2rem)] max-w-md rounded-lg bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant shadow-xl p-0 m-auto"
    >
      <header className="px-gutter-lg pt-gutter-lg pb-gutter-sm">
        <h2 id="delete-modal-title" className="font-title text-title-lg text-light-on-surface">
          Delete this task?
        </h2>
      </header>
      <div id="delete-modal-body" className="px-gutter-lg pb-gutter-md">
        <p className="font-body text-body-md text-light-on-surface-variant">
          {task
            ? `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
            : 'This task will be permanently removed from your list.'}
        </p>
      </div>
      <footer className="flex items-center justify-end gap-gutter-sm px-gutter-lg py-gutter-md border-t border-light-outline-variant">
        <button
          type="button"
          onClick={onCancel}
          className="px-gutter-md py-2 rounded bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low"
        >
          <span className="font-label text-label-lg">Cancel</span>
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-gutter-md py-2 rounded bg-danger text-on-danger hover:opacity-90"
        >
          <span className="font-label text-label-lg">Delete Task</span>
        </button>
      </footer>
    </dialog>
  );
};
