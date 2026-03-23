import type { Token, UnaryFunction, Constant, IBasicOperations } from "@/types/index.js";
import { utilities } from "@/utils/utilities.js";

const CONSTANTS: Record<Constant, number> = { pi: Math.PI, e: Math.E };

const UNARY_FUNCS: Record<UnaryFunction, (a: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  ln: Math.log, log: Math.log10, sqrt: Math.sqrt,
  NEG: (a) => -a,
};

const DEFAULT_OPS: IBasicOperations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  mod: (a, b) => a % b,
  power: (a, b) => Math.pow(a, b),
};

const isUnaryFunction = (val: string): val is UnaryFunction =>
  val in UNARY_FUNCS;

const isConstant = (val: string): val is Constant =>
  val in CONSTANTS;


type TokenHandler = (token: Token, stack: number[], ops: IBasicOperations) => void;

const handleNumber: TokenHandler = (token, stack) => {
  stack.push(Number(token.value));
};

const handleConstant: TokenHandler = (token, stack) => {
  stack.push(CONSTANTS[token.value as Constant]);
};

const handleFactorial: TokenHandler = (_token, stack) => {
  const a = stack.pop();
  if (a === undefined) throw new Error("Invalid expression");
  const r = utilities.factorial(a);
  if (typeof r !== "bigint") throw new Error(r);
  stack.push(Number(r));
};

const handleUnary: TokenHandler = (token, stack) => {
  const a = stack.pop();
  if (a === undefined) throw new Error("Invalid expression");
  stack.push(UNARY_FUNCS[token.value as UnaryFunction](a));
};

const handleBinary: TokenHandler = (token, stack, ops) => {
  const binaryOps: Record<string, (a: number, b: number) => number> = {
    "+": (a, b) => ops.add(a, b),
    "-": (a, b) => ops.subtract(a, b),
    "*": (a, b) => ops.multiply(a, b),
    "/": (a, b) => ops.divide(a, b),
    "%": (a, b) => ops.mod(a, b),
    "^": (a, b) => ops.power(a, b),
  };
  const b = stack.pop();
  const a = stack.pop();
  if (a === undefined || b === undefined) throw new Error("Invalid expression");
  const fn = binaryOps[token.value];
  if (!fn) throw new Error(`Unknown operator: ${token.value}`);
  stack.push(fn(a, b));
};

function resolveHandler(token: Token): TokenHandler {
  if (token.type === "number") return handleNumber;
  if (token.type === "identifier" && isConstant(token.value)) return handleConstant;
  if (token.value === "!") return handleFactorial;
  if (token.type === "identifier" && isUnaryFunction(token.value)) return handleUnary;
  return handleBinary;
}

export function evaluate(postfix: Token[], ops: IBasicOperations = DEFAULT_OPS): number {
  const stack: number[] = [];
  for (const token of postfix) {
    resolveHandler(token)(token, stack, ops);
  }
  const result = stack.pop();
  if (result === undefined) throw new Error("Invalid expression");
  return result;
}
