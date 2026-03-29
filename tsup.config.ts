import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react.tsx"
  },
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0"
    }
  },
  clean: true,
  sourcemap: false,
  splitting: false,
  target: "es2020",
  treeshake: true,
  external: ["react"]
});
