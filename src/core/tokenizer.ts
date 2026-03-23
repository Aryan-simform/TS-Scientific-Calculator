import type { Token } from "@/types/index.js";

const isDigit = (c: string): boolean => c >= "0" && c <= "9";
const isAlpha = (c: string): boolean => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
const isNumberChar = (c: string): boolean => isDigit(c) || c === ".";

type Collector = (peek: () => string | undefined, advance: () => string | undefined) => string;

const collectNumber: Collector = (peek, advance) => {
  let value = "";
  while (true) {
    const c = peek();
    if (!c || !isNumberChar(c)) break;
    value += advance();
  }
  return value;
};

const collectWord: Collector = (peek, advance) => {
  let value = "";
  while (true) {
    const c = peek();
    if (!c || !isAlpha(c)) break;
    value += advance();
  }
  return value;
};

type TokenFactory = (
  peek: () => string | undefined,
  advance: () => string | undefined
) => Token;

const tokenFactories: Array<[(c: string) => boolean, TokenFactory]> = [
  [
    isNumberChar,
    (peek, advance) => ({ type: "number", value: collectNumber(peek, advance) }),
  ],
  [
    isAlpha,
    (peek, advance) => ({ type: "identifier", value: collectWord(peek, advance).toLowerCase() }),
  ],
  [
    () => true, // fallthrough — single char operator
    (_peek, advance) => ({ type: "operator", value: advance()! }),
  ],
];

export function* tokenizer(exp: string): Generator<Token, void, undefined> {
  let i = 0;
  const peek = (): string | undefined => exp[i];
  const advance = (): string | undefined => exp[i++];

  while (i < exp.length) {
    const char = peek();
    if (!char) break;
    if (char === " ") { advance(); continue; }

    const factory = tokenFactories.find(([test]) => test(char));
    if (factory) yield factory[1](peek, advance);
  }
}
