
import { UtilitiesModule, FormattableNumber } from "../types";

export const utilities: UtilitiesModule = (function() {
  function formatNumber(value: FormattableNumber): string | number {
    if (typeof value === "bigint") {
      return value.toString();
    }

    value = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(value)) {
      return "error: not a number!";
    }
    return parseFloat(value.toString());
  }

  function factorial(value: number): bigint | string {
    if (value < 0) {
      return "error! number must be integer";
    }
    let res = 1n, n = BigInt(value);
    for (let i = 2n; i <= n; i++) res *= i;
    return res;
  }

  return {
    formatNumber,
    factorial,
  };
})();

