import { defineAuth } from "@aws-amplify/backend";
import { createAuthChallenge } from "./create-auth-challenge/resource";
import { defineAuthChallenge } from "./define-auth-challenge/resource";
import { preSignUp } from "./pre-sign-up/resource";
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource";

/**
 * Fontain OS — الهوية: دخول بالهاتف وOTP للفريق والعملاء (D-22).
 *
 * لا كلمة مرور في تجربة المستخدم ولا بريد: `loginWith.phone` يجعل الرقم هو المعرّف،
 * والدخول يمر عبر تدفّق Cognito المخصّص (`CUSTOM_AUTH`) بالمحفزات الأربعة أدناه.
 * منطق الرمز نفسه في `amplify/shared/otp/`.
 *
 * لماذا محفزات مخصّصة لا `phone: { otpLogin: true }` الأصلي: المواصفة تتطلب تحكّمًا
 * كاملًا في صلاحية الرمز وسقف المحاولات وحد الإرسال وقناة التسليم (`otp/` والمحفزات)،
 * وهو ما لا يوفّره الوضع الأصلي المرتبط بقناة SMS الخاصة بـCognito.
 *
 * `accountRecovery: "NONE"`: لا استرجاع كلمة مرور لأنها غير مستخدمة أصلًا، وبهذا
 * لا تُفتح قناة SMS من Cognito في أي مسار.
 *
 * يأتي في FOS-006: المجموعات الأربع (OWNER/MANAGER/STAFF/CLIENT)، سمة
 * `custom:organizationId`، وseed المؤسسة والمالك. ومعها تُستبدل صلاحيات
 * `apiKey` المؤقتة في `data/resource.ts` بـuserPool + المجموعات.
 */
export const auth = defineAuth({
  loginWith: {
    phone: true,
  },
  accountRecovery: "NONE",
  triggers: {
    defineAuthChallenge,
    createAuthChallenge,
    verifyAuthChallengeResponse,
    preSignUp,
  },
});
