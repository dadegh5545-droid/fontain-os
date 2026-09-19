/**
 * Fontain OS — ثوابت الـOTP (FOS-005).
 *
 * قيمة واحدة لكل ضمان، تُقرأ من المحفزات الثلاثة ومن اختبارات الوحدة معًا،
 * حتى لا يتفرّق التحقق بين `defineAuthChallenge` و`verifyAuthChallengeResponse`.
 */

/** طول الرمز. 6 خانات: مألوف للمستخدم ومساحة 10^6 كافية مع سقف المحاولات والصلاحية القصيرة. */
export const OTP_CODE_LENGTH = 6;

/** صلاحية الرمز بالثواني (5 دقائق). */
export const OTP_TTL_SECONDS = 300;

/** أقصى عدد محاولات إدخال للرمز نفسه قبل رفض المصادقة نهائيًا. */
export const OTP_MAX_ATTEMPTS = 3;

/** أقصى عدد رموز تُرسل لنفس المستخدم داخل نافذة الإرسال (حماية من إغراق SMS). */
export const OTP_MAX_SENDS_PER_WINDOW = 5;

/** طول نافذة حد الإرسال بالثواني (ساعة). */
export const OTP_SEND_WINDOW_SECONDS = 3600;

/**
 * مهلة إضافية يبقى فيها سجل التحدي في الجدول بعد انتهاء صلاحيته، قبل أن يحذفه TTL.
 * تُبقي عدّاد نافذة الإرسال قائمًا بعد انتهاء الرمز نفسه، وإلا لأمكن تصفير الحد
 * بمجرد انتظار انتهاء الرمز.
 */
export const OTP_RECORD_RETENTION_SECONDS = OTP_SEND_WINDOW_SECONDS + 300;

/** اسم التحدي المخصّص الوحيد المسموح في هذا النظام. */
export const CUSTOM_CHALLENGE_NAME = "CUSTOM_CHALLENGE";
