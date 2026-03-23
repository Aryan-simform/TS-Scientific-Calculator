import { Calculator } from "@/calculator/Calculator.js";
import { initUI } from "@/ui/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const calc = new Calculator();
  initUI(calc);
});
