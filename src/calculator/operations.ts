import type { IBasicOperations } from "@/types";

export function BasicOperations(this: IBasicOperations) {
}

BasicOperations.prototype.add = (a: number, b: number): number => a + b;
BasicOperations.prototype.subtract = (a: number, b: number): number => a - b;
BasicOperations.prototype.multiply = (a: number, b: number): number => a * b;
BasicOperations.prototype.divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Can't divide by 0");
  return a / b;
}
BasicOperations.prototype.mod = (a: number, b: number): number => a % b;

BasicOperations.prototype.power = (a: number, b: number): number => a ** b;

BasicOperations.prototype as IBasicOperations;
