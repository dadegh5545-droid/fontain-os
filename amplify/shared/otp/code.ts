/**
 * Fontain OS — توليد رمز الـOTP والتحقق منه (FOS-005).
 *
 * منطق نقي بلا AWS ولا شبكة، فيُختبر بـvitest كما تنص استراتيجية الاختبار.
 * الضمانات هنا: رمز عشوائي معماريًا، مقارنة بالهاش لا بالنص، مقارنة ثابتة الزمن،
 * وقبول الأرقام العربية كما يكتبها المستخدم فعلًا.
 */

import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { toAsciiDigits } from "../../../shared/phone";
import { OTP_CODE_LENGTH } from "./config";

/** يولّد رمزًا رقميًا بطول `length` باستخدام مولّد عشوائي معماري (لا `Math.random`). */
export function generateOtpCode(length: number = OTP_CODE_LENGTH): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += String(randomInt(0, 10));
  }
  return code;
}

/** يولّد ملحًا سداسي‑عشريًا لكل تحدٍ، فلا يكون الهاش قابلًا للمطابقة بجدول مسبق. */
export function generateOtpSalt(): string {
  return randomBytes(16).toString("hex");
}

/** هاش الرمز: `sha256(salt + ":" + code)` بصيغة hex. الرمز نفسه لا يُخزَّن أبدًا. */
export function hashOtpCode(code: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${code}`, "utf8").digest("hex");
}

/** مقارنة ثابتة الزمن لسلسلتَي hex. تعيد `false` لأي مدخل غير صالح بدل أن ترمي. */
export function safeCompareHex(left: string, right: string): boolean {
  if (typeof left !== "string" || typeof right !== "string") return false;
  if (left.length !== right.length || left.length === 0) return false;
  if (!/^[0-9a-f]+$/i.test(left) || !/^[0-9a-f]+$/i.test(right)) return false;
  try {
    return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
  } catch {
    return false;
  }
}

/**
 * يطبّع الرمز كما أدخله المستخدم: أرقام عربية/فارسية إلى ASCII، وإزالة كل ما ليس رقمًا
 * (مسافات، شرطات، محدّدات الاتجاه التي تلتصق بالنسخ من الرسائل).
 */
export function normalizeSubmittedCode(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return toAsciiDigits(raw).replace(/[^0-9]/g, "");
}

/** الوقت الحالي بثوانٍ منذ epoch (وحدة كل حسابات الصلاحية وTTL في DynamoDB). */
export function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/** هل انتهت صلاحية الرمز؟ `expiresAt` لحظة الانتهاء بالثواني. */
export function isOtpExpired(expiresAt: number, now: number): boolean {
  if (!Number.isFinite(expiresAt)) return true;
  return now >= expiresAt;
}
