export type Operator = "+" | "-" | "*" | "/" | "%" | "^";
export type Parenthesis = "(" | ")";

export type UnaryFunction = "sin" | "cos" | "tan" | "ln" | "log" | "sqrt" | "NEG";

export type Constant = "e" | "pi";

export type HistoryEntry = string;

export type Associativity = "left" | "right";

export type ButtonAction = "clear" | "delete" | "toggleSign" | "calculate" | "reciprocal" | "factorial";

export type FormattableNumber = number | bigint | string;

export type PrecedenceMap = Record<string, number>;

export type AssociativityMap = Record<string, Associativity>;
export type Token =
  | { type: "number"; value: string }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: string };


export interface HistoryManager {
  add(Entry: HistoryEntry): void;
  get(): HistoryEntry[];
  clear(): void;
}

export interface UtilitiesModule {
  formatNumber(number: FormattableNumber): number | string;
  factorial(number: number): bigint | string;
}

export interface IBasicOperations {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number
  divide(a: number, b: number): number
  mod(a: number, b: number): number;
  power(a: number, b: number): number;
}

export interface CalcUIElements {
  currentDisplay: HTMLElement;
  historyDisplay: HTMLElement;
  historyList: HTMLElement;
  grid: HTMLElement;
  themeBtn: HTMLButtonElement;
  clearHistoryBtn: HTMLButtonElement;
}


