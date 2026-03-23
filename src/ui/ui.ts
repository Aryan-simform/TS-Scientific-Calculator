import { Calculator } from "@/calculator/Calculator.js";
import { history } from "@/history/history.js";
import type { ButtonAction, CalcUIElements, Operator, Parenthesis, ScientificOp } from "@/types/index.js";

export function initUI(calc: Calculator): void {

  function getElemenet<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element by id : ${id} not found`);
    }
    return element as T;
  }

  const elements: CalcUIElements = {
    currentDisplay: getElemenet("currentDisplay"),
    historyDisplay: getElemenet("historyDisplay"),
    historyList: getElemenet("historyList"),
    grid: getElemenet("button-grid"),
    themeBtn: getElemenet<HTMLButtonElement>('themeBtn'),
    clearHistoryBtn: getElemenet<HTMLButtonElement>("clearHistoryBtn"),
  }

  function updateDisplay(): void {
    elements.currentDisplay.textContent = calc.current;
    elements.historyDisplay.textContent = calc.expression;
    renderHistory();
  }

  function renderHistory(): void {
    const data = history.get();
    elements.historyList.innerHTML = "";
    if (data.length === 0) {
      elements.historyList.innerHTML = '<p class="empty-message">No calculations yet</p>';
      return;
    }
    data.forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.textContent = item;
      elements.historyList.appendChild(div);
    });
  }

  function handleAction(action: ButtonAction): void {
    const actions: Record<ButtonAction, () => void> = {
      clear: () => calc.clear(),
      delete: () => calc.delete(),
      toggleSign: () => calc.toggleSign(),
      calculate: () => calc.calculate(),
      reciprocal: () => calc.reciprocal(),
      factorial: () => calc.factorial(),
    };
    actions[action]?.();
  }

  elements.grid.addEventListener("click", (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest("button");
    if (!btn) return;

    const { number, operator, function: func, action } = btn.dataset;

    if (number !== undefined) calc.inputNumber(number);
    else if (operator !== undefined) calc.setOperator(operator as Operator | Parenthesis);
    else if (func !== undefined) calc.scientific(func as ScientificOp);
    else if (action !== undefined) handleAction(action as ButtonAction);

    updateDisplay();
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (/^\d$/.test(e.key) || e.key === ".") calc.inputNumber(e.key);
    else if (["+", "-", "*", "/", "^", "(", ")"].includes(e.key))
      calc.setOperator(e.key as Operator | Parenthesis);
    else if (e.key === "Enter") calc.calculate();
    else if (e.key === "Backspace") calc.delete();
    else if (e.key.toLowerCase() === "c") calc.clear();
    updateDisplay();
  });

  elements.themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  elements.clearHistoryBtn.addEventListener("click", () => {
    history.clear();
    renderHistory();
  });
}
