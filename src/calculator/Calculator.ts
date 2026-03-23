import { BasicOperations } from "@/calculator/operations.js";
import type { CalculatorState, Operator, Parenthesis } from "@/types/index.js";
import { tokenizer } from "@/core/tokenizer.js";
import { parse } from "@/core/parser.js";
import { evaluate } from "@/core/evaluator.js";
import { history } from "@/history/history.js";
import { utilities } from "@/utils/utilities.js";
type AtomFinder = (expr: string, end: number) => number;

const findParenStart: AtomFinder = (expr, end) => {
  let depth = 0;
  for (let i = end; i >= 0; i--) {
    if (expr[i] === ")") depth++;
    else if (expr[i] === "(") depth--;
    if (depth === 0) return i;
  }
  return end;
};

const findWordStart: AtomFinder = (expr, end) => {
  for (let i = end; i >= 0; i--) {
    const c = expr[i];
    if (!c || !isAlpha(c)) return i + 1;
  }
  return 0;
};

const findNumberStart: AtomFinder = (expr, end) => {
  for (let i = end; i >= 0; i--) {
    const c = expr[i];
    if (!c || !isDigitOrDot(c)) return i + 1;
  }
  return 0;
};

const isDigitOrDot = (c: string): boolean => (c >= "0" && c <= "9") || c === ".";
const isAlpha = (c: string): boolean => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");

export class Calculator extends BasicOperations implements CalculatorState {
  current: string = "0";
  expression: string = "";
  clearFlag: boolean = false;
  static operators = new Set(["+", "-", "*", "/", "%", "^"]);

  //set the current number and reset the clearFlag
  inputNumber(number: string): void {
    if (this.clearFlag) {
      this.expression = "";
      this.clearFlag = false;
    }
    this.expression += number;
    this.current = this.expression || "0";
  }

  setOperator(op: Operator | Parenthesis): void {
    if (this.clearFlag) {
      this.expression = this.current === "0" ? "" : this.current;
      this.clearFlag = false;
    }

    const last = this.expression[this.expression.length - 1];

    // case 1: empty expression
    if (!this.expression) {
      if (op === "-" || op === "(") this.expression = op;
      this.current = this.expression;
      return;
    }

    // case 2: after open paren
    if (last === "(") {
      if (op === "-" || op === "(") this.expression += op;
      this.current = this.expression;
      return;
    }

    // case 3: replace or append
    this.expression = last && Calculator.operators.has(last)
      ? this.expression.slice(0, -1) + op
      : this.expression + op;

    this.current = this.expression;
  }
  calculate(): void {

    if (!this.expression) return;
    try {
      const tokens = [...tokenizer(this.expression)];
      const postfix = parse(tokens);
      const result = evaluate(postfix);
      history.add(`${this.expression} = ${result}`);
      this.current = String(utilities.formatNumber(result));
      this.expression = this.current;
      this.clearFlag = true;
    } catch (err: unknown) {
      if (err instanceof Error) this.current = err.message;
      else this.current = "Error";
      this.expression = "";
    }

  }
  clear(): void {
    this.expression = "";
    this.current = "0";
  }

  delete(): void {
    this.expression = this.expression.slice(0, -1);
    this.current = this.expression || "0";
  }
  private replaceLastAtom(replacer: (atom: string) => string): void {
    if (!this.expression) return;

    let end = this.expression.length - 1;
    while (end >= 0 && this.expression[end] === " ") end--;
    if (end < 0) return;

    const char = this.expression[end];
    if (!char) return;

    const finder: AtomFinder =
      char === ")" ? findParenStart :
        isAlpha(char) ? findWordStart :
          findNumberStart;

    const start = finder(this.expression, end);
    const atom = this.expression.slice(start, end + 1);
    const replaced = replacer(atom);
    this.expression = this.expression.slice(0, start) + replaced + this.expression.slice(end + 1);
    this.current = this.expression || "0";
  } toggleSign(): void {
    this.replaceLastAtom((atom) => {
      if (!atom) return atom;
      if (atom.startsWith("-")) return atom.slice(1);
      return `-${atom}`;
    });
  }

  reciprocal(): void {
    this.replaceLastAtom((atom) => {
      if (!atom || atom === "0") return atom;
      return `(1/(${atom}))`;
    });
  }
  factorial(): void {
    this.expression += "!";
    this.current = this.expression;
  }

  scientific(op: string): void {
    if (op === "pi" || op === "e") {
      this.expression += op;
    } else {
      this.expression += `${op}(`;
    }
    this.current = this.expression;
  }
}
