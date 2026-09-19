/**
 * Fontain OS — محفّز `preSignUp` (FOS-005).
 *
 * يؤكّد المستخدم ويعتمد رقمه تلقائيًا، فلا يُرسل Cognito رسالة تحقق عند الإنشاء.
 * التحقق من ملكية الرقم يحدث في كل دخول عبر الـOTP نفسه، لا مرة واحدة عند التسجيل،
 * وبهذا لا تُستخدم قناة SMS الخاصة بـCognito أصلًا.
 *
 * يعمل على `PreSignUp_AdminCreateUser` أيضًا، وهو المسار الذي يستخدمه seed الفريق
 * وإنشاء مستخدمي البوابة (FOS-006).
 */

import type { PreSignUpTriggerHandler } from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (event) => {
  event.response.autoConfirmUser = true;

  if (event.request.userAttributes.phone_number) {
    event.response.autoVerifyPhone = true;
  }

  return event;
};
