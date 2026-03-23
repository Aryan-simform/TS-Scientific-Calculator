import type { HistoryManager, HistoryEntry } from "@/types/index.js";

const STORAGE_KEY = "calculationHistory"; // define once at top of file
function createHistroy(): HistoryManager {
  let history: HistoryEntry[] = []
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    history = stored ? JSON.parse(stored) as HistoryEntry[] : [];
  } catch {
    history = [];
  }
  function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  return {
    add(Entry: HistoryEntry) {
      history.unshift(Entry);
      saveHistory();
    },
    get() {
      return history;
    },
    clear() {
      history = [];
      saveHistory();
    },
  };
}

export const history = createHistroy();

