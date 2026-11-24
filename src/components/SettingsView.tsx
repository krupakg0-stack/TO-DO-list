import React, { useEffect, useState } from 'react';

interface SettingsViewProps {
  userName: string;
  onSaveName: (name: string) => void;
  onClearCompleted: () => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  onSaveName,
  onClearCompleted,
  onResetDemo,
}) => {
  const [nameInput, setNameInput] = useState(userName);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const handleSave = () => {
    onSaveName(nameInput);
  };

  return (
    <section className="flex flex-col gap-gutter-md" aria-label="Workspace settings">
      <div className="bg-light-surface-container-lowest border border-light-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col gap-gutter-lg max-w-2xl">
        <div className="flex flex-col gap-gutter-xs border-b border-light-outline-variant pb-gutter-md">
          <h2 className="font-headline text-headline-md text-light-on-surface">
            Workspace Settings
          </h2>
          <p className="font-body text-body-md text-light-on-surface-variant">
            Personalize your TaskFlow greeting and manage your task data.
          </p>
        </div>

        <div className="flex flex-col gap-gutter-md">
          <label className="flex flex-col gap-gutter-xs">
            <span className="font-label text-label-md text-light-on-surface">Display Name</span>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
              className="w-full rounded border border-light-outline-variant bg-light-surface px-3 py-2 font-body text-body-md text-light-on-surface focus:border-light-primary focus:ring-2 focus:ring-light-primary-container focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap items-center gap-gutter-sm pt-gutter-sm">
            <button
              type="button"
              onClick={handleSave}
              className="px-gutter-md py-2 rounded bg-light-primary text-light-on-primary hover:bg-brand-indigo transition-colors duration-state-change whitespace-nowrap"
            >
              <span className="font-label text-label-lg">Save Preferences</span>
            </button>
            <button
              type="button"
              onClick={onClearCompleted}
              className="px-gutter-md py-2 rounded bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-low transition-colors duration-state-change whitespace-nowrap"
            >
              <span className="font-label text-label-lg">Clear Completed Tasks</span>
            </button>
            <button
              type="button"
              onClick={onResetDemo}
              className="px-gutter-md py-2 rounded bg-danger-container text-on-danger-container hover:opacity-90 transition-colors duration-state-change whitespace-nowrap"
            >
              <span className="font-label text-label-lg">Reset Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
