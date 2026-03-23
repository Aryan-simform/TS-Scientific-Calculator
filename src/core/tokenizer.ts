import { Token } from "@/types/index.js";
export function* tokenizer(exp: string): Generator<Token, void, undefined> {

  let i = 0;
  const isDigit = (c: string) => c >= "0" && c <= "9";
  const isAlpha = (c: string) =>
    (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");

  const isNumberChar = (c: string) => isDigit(c) || c === ".";
  const peek = () => exp[i];          // string | undefined
  const advance = () => exp[i++];     // string | undefined

  while (i < exp.length) {
    const char = peek();
    if (!char) break;

    if (char === " ") {
      advance();
      continue;
    }

    if (isNumberChar(char)) {
      let value = "";

      while (true) {
        const c = peek();
        if (!c || !isNumberChar(c)) break;

        value += advance();
      }

      yield { type: "number", value };
      continue;
    }

    if (isAlpha(char)) {
      let value = "";

      while (true) {
        const c = peek();
        if (!c || !isAlpha(c)) break;

        value += advance();
      }

      yield { type: "identifier", value: value.toLowerCase() };
      continue;
    }
    // safe: char is already confirmed non-null by the peek() + if(!char) break above
    yield { type: "operator", value: advance()! };
  }
}
