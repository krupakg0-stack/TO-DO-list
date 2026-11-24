import React from 'react';
import { Task, TaskPriority } from '../types/task';
import { isTaskOverdue } from '../utils/taskHelpers';

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-danger-container text-on-danger-container whitespace-nowrap shrink-0">
        <span className="font-label text-label-md">High</span>
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-warning-container text-on-warning-container whitespace-nowrap shrink-0">
        <span className="font-label text-label-md">Medium</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container whitespace-nowrap shrink-0">
      <span className="font-label text-label-md">Low</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ task: Task; todayIso: string }> = ({ task, todayIso }) => {
  if (task.completed) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container whitespace-nowrap shrink-0">
        <span className="font-label text-label-md">Completed</span>
      </span>
    );
  }
  if (isTaskOverdue(task, todayIso)) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-danger-container text-on-danger-container whitespace-nowrap shrink-0">
        <span className="font-label text-label-md">Overdue</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-light-primary-container text-light-on-primary-container whitespace-nowrap shrink-0">
      <span className="font-label text-label-md">Pending</span>
    </span>
  );
};
