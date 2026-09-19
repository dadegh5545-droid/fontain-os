import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // `.amplify/**` = مخرجات CDK المولَّدة من `ampx sandbox` (مُتجاهلة في git وprettier أيضًا).
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts", ".amplify/**"]),
]);

export default eslintConfig;
