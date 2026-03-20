import type { Token, PrecedenceMap, AssociativityMap, UnaryFunction, Constant } from "@/types";

type Handler = (token: Token) => void;

const NEG_TOKEN: Token = { type: "operator", value: "NEG" };

const precedence: PrecedenceMap = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
  NEG: 4
};

const associativity: AssociativityMap = {
  "+": "left",
  "-": "left",
  "*": "left",
  "/": "left",
  "%": "left",
  "^": "right",
  NEG: "right"
};

function isConstant(val: string): val is Constant {
  return val === "e" || val === "pi";
}

const isFunc = (v: string): v is UnaryFunction =>
  ["sin", "cos", "tan", "ln", "log", "sqrt", "NEG"].includes(v);

export function parse(tokens: Iterable<Token>): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];
  let prev: Token | null = null;

  const isUnaryContext = (): boolean =>
    prev === null ||
    (prev.type === "operator" && ["(", "+", "-", "*", "/", "%", "^"].includes(prev.value)) ||
    (prev.type === "identifier" && isFunc(prev.value));

  function handleCloseParen(): void {
    while (stack.length && stack[stack.length - 1]?.value !== "(") {
      const t = stack.pop();
      if (t) output.push(t);
    }
    stack.pop();
    const top = stack[stack.length - 1];
    if (top?.type === "identifier" && isFunc(top.value)) {
      const t = stack.pop();
      if (t) output.push(t);
    }
  }

  function processOperator(token: Token): void {
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (!top) break;
      const pTop = precedence[top.value];
      const pToken = precedence[token.value];
      if (pTop === undefined || pToken === undefined) break;
      const higher = pTop > pToken;
      const equalLeft = pTop === pToken && associativity[token.value] === "left";
      if (higher || equalLeft) {
        const t = stack.pop();
        if (t) output.push(t);
      } else break;
    }
    stack.push(token);
  }

  const handleNumber = (token: Token): void => {
    output.push(token);
    prev = token;
  };

  const handleIdentifier = (token: Token): void => {
    const v = token.value;
    if (isConstant(v)) output.push(token);
    else if (isFunc(v)) stack.push(token);
    prev = token;
  };

  const handleOperator = (token: Token): void => {
    const v = token.value;
    if (v === "(") { stack.push(token); }
    else if (v === ")") { handleCloseParen(); }
    else if (v === "!") { output.push(token); }
    else if (v === "-" && isUnaryContext()) { stack.push(NEG_TOKEN); }
    else { processOperator(token); }
    prev = token;
  };

  const handlers: Record<Token["type"], Handler> = {
    number: handleNumber,
    identifier: handleIdentifier,
    operator: handleOperator,
  };

  for (const token of tokens) {
    handlers[token.type](token);
  }

  while (stack.length) {
    const t = stack.pop();
    if (t) output.push(t);
  }

  return output;
}
