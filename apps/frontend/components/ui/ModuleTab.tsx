'use client';

interface Tab {
  key: string;
  label: string;
}

interface ModuleTabProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function ModuleTab({ tabs, active, onChange }: ModuleTabProps) {
  return (
    <div className="flex items-center gap-1 border-b" style={{ borderColor: '#E9E0F8' }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: isActive ? '#714B67' : '#A5A3AE',
            }}
          >
            {tab.label}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: '#714B67' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
