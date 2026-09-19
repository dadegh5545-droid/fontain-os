import { defineFunction } from "@aws-amplify/backend";

/** يتحقق من الرمز المُدخَل. `OTP_TABLE_NAME` يُضاف في `amplify/backend.ts`. */
export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 10,
});
