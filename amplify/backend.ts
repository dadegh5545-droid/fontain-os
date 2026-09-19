import { defineBackend } from "@aws-amplify/backend";
import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { auth } from "./auth/resource";
import { createAuthChallenge } from "./auth/create-auth-challenge/resource";
import { verifyAuthChallengeResponse } from "./auth/verify-auth-challenge-response/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

/**
 * Fontain OS — Amplify Gen 2 backend.
 *
 * الموارد: `auth` (هاتف + OTP، FOS-005)، `data` (Organization + UserProfile، FOS-004)،
 * و`storage` (هيكل فارغ). تُضاف لاحقًا: المجموعات وسمة `custom:organizationId` (FOS-006)،
 * ثم `functions/` بنمط Custom Mutation + ActivityLog (FOS-007).
 * المنطقة `ap-south-1` (D-26) تُضبط في sandbox/Console لا هنا.
 *
 * دالتا الـOTP مُمرَّرتان لـ`defineBackend` كي يمكن منحهما صلاحية الجدول وتمرير اسمه.
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  createAuthChallenge,
  verifyAuthChallengeResponse,
});

/**
 * جدول تحديات الـOTP: هاش الرمز وملحه وعدّاد المحاولات وحد الإرسال، بمفتاح
 * مستخدم Cognito. لا يحتوي الرمز نفسه، وTTL يحذف السجلات تلقائيًا.
 *
 * `PROVISIONED` بسعة 1/1: حجم الحركة هو عملية كتابة واحدة لكل طلب دخول، وهذه السعة
 * تبقى داخل الطبقة المجانية لـDynamoDB. تُراجع عند النشر الإنتاجي (FOS-010).
 * `RemovalPolicy.DESTROY` مقصود: البيانات مؤقتة بطبيعتها (صلاحية 5 دقائق)،
 * فلا معنى للإبقاء عليها بعد حذف المكدّس.
 */
const otpStack = backend.createStack("otp");

const otpChallengeTable = new Table(otpStack, "OtpChallenges", {
  partitionKey: { name: "userKey", type: AttributeType.STRING },
  billingMode: BillingMode.PROVISIONED,
  readCapacity: 1,
  writeCapacity: 1,
  timeToLiveAttribute: "ttl",
  removalPolicy: RemovalPolicy.DESTROY,
});

for (const otpFunction of [backend.createAuthChallenge, backend.verifyAuthChallengeResponse]) {
  otpChallengeTable.grantReadWriteData(otpFunction.resources.lambda);
  otpFunction.addEnvironment("OTP_TABLE_NAME", otpChallengeTable.tableName);
}
