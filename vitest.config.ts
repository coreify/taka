import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx", "*.test.ts"],
    exclude: ["tests/package-e2e.test.ts"]
  }
});
