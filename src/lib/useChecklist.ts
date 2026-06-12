import { useCallback, useEffect, useState } from 'react';

const KEY = 'iceland-trip-checks-v1';

function load(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function useChecklist() {
  const [checks, setChecks] = useState<Record<string, boolean>>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(checks));
  }, [checks]);

  const toggle = useCallback((id: string) => {
    setChecks(c => ({ ...c, [id]: !c[id] }));
  }, []);

  return { checks, toggle };
}
