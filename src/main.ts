import { Calculator } from "@/calculator/Calculator";
import { initUI } from "@/ui/ui";

document.addEventListener("DOMContentLoaded", () => {
  const calc = new Calculator();
  initUI(calc);
});
