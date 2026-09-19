import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { ROLES } from "../../shared/enums";

/**
 * ============================================================================
 * TEMPORARY SANDBOX AUTH — MUST BE REMOVED IN FOS-005/FOS-006
 * ============================================================================
 * لا يوجد Cognito بعد (يأتي في FOS-005)، لذا يستخدم هذا الهيكل مفتاح API مؤقتًا
 * (`apiKey`، 30 يومًا) و`allow.publicApiKey()` فقط ليكون قابلًا للنشر على sandbox المطور.
 *
 * هذا ليس تصميم الصلاحيات النهائي ولا يُعتمد للإنتاج أبدًا. يُستبدل في FOS-005/FOS-006 بـ:
 *   userPool + OWNER / MANAGER / STAFF / CLIENT group authorization
 *   (`allow.groups(['OWNER','MANAGER','STAFF'])` للفريق، `allow.group('CLIENT')` قراءة للبوابة،
 *   و`allow.resource(fn)` للـLambdas) كما في docs/data-schema.md §2 وD-06/D-11.
 *
 * ممنوع إدخال بيانات حقيقية أو seed لمستخدمين/عملاء ما دام هذا الوضع قائمًا.
 * ============================================================================
 */
const schema = a.schema({
  /**
   * الجذر. مؤسسة واحدة مُهيأة مسبقًا بالـseed (D-03)، و`id` هذا السجل هو `organizationId`
   * الذي يحمله كل كيان آخر إجباريًا. لا يحتاج الجذر إلى حقل organizationId ذاتي.
   */
  Organization: a
    .model({
      name: a.string().required(),
      phone: a.string(),
      /** AWSJSON — يُكتب عبر toJsonField() ويُقرأ بـparseJsonArray(). الافتراضي 50% / 50% (D-42). */
      defaultPaymentSchedule: a.json(),
      /** سقف الـAI الشهري الاختياري بالريال القطري (D-29). فارغ = بلا سقف. */
      aiMonthlyLimit: a.float(),
      /** AWSJSON — قائمة featureKey المفعّلة. */
      aiEnabledFeatures: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  /**
   * ملف المستخدم داخل المؤسسة. يُربط بـCognito عبر `cognitoSub` (FOS-005/006).
   * `clientId` يُملأ فقط لدور CLIENT (مستخدم البوابة).
   */
  UserProfile: a
    .model({
      organizationId: a.string().required(),
      cognitoSub: a.string().required(),
      name: a.string().required(),
      phone: a.string().required(),
      role: a.enum([...ROLES]),
      isActive: a.boolean().required().default(true),
      clientId: a.string(),
    })
    .secondaryIndexes((index) => [
      index("organizationId").queryField("listUserProfilesByOrganization"),
      index("cognitoSub").queryField("listUserProfilesByCognitoSub"),
    ])
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // TEMPORARY SANDBOX AUTH — MUST BE REMOVED IN FOS-005/FOS-006 (انظر التعليق أعلاه).
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
