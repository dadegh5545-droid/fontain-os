import { defineFunction } from "@aws-amplify/backend";

/** يؤكّد المستخدم ويعتمد رقمه، فلا يُرسل Cognito أي رسالة تحقق. */
export const preSignUp = defineFunction({
  name: "pre-sign-up",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 10,
});
