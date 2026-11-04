import { defineConfig } from "allure";

export default defineConfig({
  name: "VWO Login Dashboard - Playwright",
  output: "./allure-report",
  plugins: {
    awesome: {
      options: {
        reportName: "VWO Login Dashboard - Playwright",
        singleFile: true,
        reportLanguage: "en",
        groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },
  },
});
