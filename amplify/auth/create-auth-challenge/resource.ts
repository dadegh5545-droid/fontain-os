import { defineFunction } from "@aws-amplify/backend";

/**
 * يُصدر رمز الـOTP ويسلّمه. `OTP_TABLE_NAME` يُضاف في `amplify/backend.ts` بعد إنشاء الجدول.
 *
 * `OTP_DELIVERY_MODE` مصرَّح به هنا لا افتراضيًا في الكود، حتى تكون قناة التسليم
 * ظاهرة في المراجعة: `log` لـsandbox، وتُبدَّل إلى `sms` عند وصل المزوّد للإنتاج.
 */
export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 10,
  environment: {
    OTP_DELIVERY_MODE: "log",
  },
});
