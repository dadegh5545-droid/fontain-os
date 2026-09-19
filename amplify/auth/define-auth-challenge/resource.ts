import { defineFunction } from "@aws-amplify/backend";

/** يقرّر خطوة المصادقة التالية. لا يلمس أي مورد خارجي. */
export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 10,
});
