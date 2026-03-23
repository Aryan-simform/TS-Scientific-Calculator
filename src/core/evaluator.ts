import type { Token, UnaryFunction, Constant, IBasicOperations } from "@/types/index.js";
import { utilities } from "@/utils/utilities.js";
const constants: Record<Constant, number> = {
  pi: Math.PI,
  e: Math.E,
};
function isUnaryFunction(val: string): val is UnaryFunction {
  return ["sin", "cos", "tan", "ln", "log", "sqrt", "NEG"].includes(val);
}

const operations: IBasicOperations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  mod: (a, b) => a % b,
  power: (a, b) => Math.pow(a, b),
};

const unaryFunctions: Record<UnaryFunction, (a: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  ln: Math.log,
  log: Math.log10,
  sqrt: Math.sqrt,
  NEG: (a: number) => -a,
};

export function evaluate(postfix: Token[], ops: IBasicOperations = operations): number {

  const stack: number[] = [];

  const binaryOps: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => ops.add(a, b),
    "-": (a, b) => ops.subtract(a, b),
    "*": (a, b) => ops.multiply(a, b),
    "/": (a, b) => ops.divide(a, b),
    "%": (a, b) => ops.mod(a, b),
    "^": (a, b) => ops.power(a, b),
  };

  for (const token of postfix) {

    // number
    if (token.type === "number") {
      stack.push(Number(token.value));
      continue;
    }

    // constants
    if (token.type === "identifier" && token.value in constants) {
      stack.push(constants[token.value as Constant]);
      continue;
    }

    // factorial
    if (token.value === "!") {
      const temp = stack.pop();
      if (temp === undefined) throw new Error("Invalid expression");

      const r = utilities.factorial(temp);
      if (typeof r !== "bigint") throw new Error(r);

      stack.push(Number(r));
      continue;
    }

    // unary functions
    if (token.type === "identifier" && isUnaryFunction(token.value)) {
      const temp = stack.pop();
      if (temp === undefined) throw new Error("Invalid expression");

      const fn = unaryFunctions[token.value];
      stack.push(fn(temp));
      continue;
    }

    // binary operators
    const b = stack.pop();
    const a = stack.pop();

    if (a === undefined || b === undefined) {
      throw new Error("Invalid expression");
    }

    const fn = binaryOps[token.value];
    if (!fn) throw new Error(`Unknown operator: ${token.value}`);
    stack.push(fn(a, b));
  }

  const result = stack.pop();
  if (result === undefined) throw new Error("Invalid expression");

  return result;
}
