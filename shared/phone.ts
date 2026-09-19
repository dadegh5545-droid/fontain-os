/**
 * Fontain OS — تطبيع أرقام الهاتف (FOS-005).
 *
 * العقد المحايد بين الواجهة والخلفية: الدخول بالهاتف وOTP (D-22)، والرقم يُخزَّن
 * ويُستخدم كاسم مستخدم في Cognito بصيغة E.164 دائمًا (`+97433001122`).
 * المدخلات الواقعية تأتي بأرقام عربية (٣٣٠٠١١٢٢)، بمسافات وشرطات، وبـ`00974`،
 * وبصفر بادئ محلي، فكلها تُطبَّع إلى صيغة واحدة قبل أي مقارنة أو تخزين.
 *
 * الافتراضي قطر (`+974`) لأن المؤسسة الواحدة المُهيأة بالـseed قطرية (D-03/D-25).
 */

/** رمز الدولة الافتراضي بلا `+` (قطر). */
export const DEFAULT_COUNTRY_CODE = "974";

/** طول الرقم المحلي القطري بعد رمز الدولة. */
const QATAR_LOCAL_LENGTH = 8;

/** بادئات الجوال القطري المعروفة. تكرار غير معروف يحذّر ولا يمنع (نفس فلسفة تكرار الهاتف في Leads). */
const QATAR_MOBILE_PREFIXES = ["3", "5", "6", "7"] as const;

/** الحد الأدنى والأقصى لعدد أرقام E.164 بعد `+` (ITU-T E.164). */
const E164_MIN_DIGITS = 8;
const E164_MAX_DIGITS = 15;

/**
 * يحوّل الأرقام العربية‑الهندية (`٠١٢٣٤٥٦٧٨٩`) والفارسية (`۰۱۲۳۴۵۶۷۸۹`) إلى ASCII،
 * ويُبقي كل ما عداها كما هو. يُستخدم للهاتف ولرمز الـOTP معًا.
 */
export function toAsciiDigits(input: string): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    if (code >= 0x0660 && code <= 0x0669) {
      out += String(code - 0x0660); // ٠-٩
    } else if (code >= 0x06f0 && code <= 0x06f9) {
      out += String(code - 0x06f0); // ۰-۹
    } else {
      out += char;
    }
  }
  return out;
}

/** يتحقق أن القيمة بصيغة E.164 صالحة: `+` ثم رقم أول غير صفري ثم 8..15 خانة. */
export function isE164(value: string): boolean {
  if (!value.startsWith("+")) return false;
  const digits = value.slice(1);
  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return false;
  if (!/^[1-9][0-9]*$/.test(digits)) return false;
  return true;
}

/**
 * يطبّع رقمًا مُدخَلًا إلى E.164، أو يعيد `null` إن كان غير صالح.
 *
 * الترتيب: تحويل الأرقام إلى ASCII، إزالة الفواصل (مسافات، `-`، `.`، أقواس)،
 * ثم استنتاج رمز الدولة من `+`، أو `00`، أو الطول المحلي، أو رمز الدولة بلا `+`.
 */
export function normalizePhone(
  raw: string,
  defaultCountryCode: string = DEFAULT_COUNTRY_CODE,
): string | null {
  if (typeof raw !== "string") return null;

  const cleaned = toAsciiDigits(raw).replace(/[\s\-().‏‎]/g, "");
  if (cleaned.length === 0) return null;

  let digits: string;
  if (cleaned.startsWith("+")) {
    digits = cleaned.slice(1);
  } else if (cleaned.startsWith("00")) {
    digits = cleaned.slice(2);
  } else if (cleaned.startsWith(defaultCountryCode)) {
    digits = cleaned;
  } else {
    // رقم محلي: صفر بادئ اختياري (عادة عربية شائعة وإن لم يكن قطريًا).
    const local = cleaned.startsWith("0") ? cleaned.slice(1) : cleaned;
    digits = `${defaultCountryCode}${local}`;
  }

  if (!/^[0-9]+$/.test(digits)) return null;

  const candidate = `+${digits}`;
  return isE164(candidate) ? candidate : null;
}

/**
 * هل الرقم جوال قطري بصيغة E.164 وببادئة معروفة؟ يُستخدم للتحذير لا للمنع،
 * لأن العملاء قد يكونون خارج قطر.
 */
export function isQatarMobile(e164: string): boolean {
  if (!isE164(e164)) return false;
  const digits = e164.slice(1);
  if (!digits.startsWith(DEFAULT_COUNTRY_CODE)) return false;
  const local = digits.slice(DEFAULT_COUNTRY_CODE.length);
  if (local.length !== QATAR_LOCAL_LENGTH) return false;
  return QATAR_MOBILE_PREFIXES.some((prefix) => local.startsWith(prefix));
}

/** يُخفي وسط الرقم للسجلات: `+97433001122` → `+974****1122`. لا يُطبع رقم كامل في CloudWatch. */
export function maskPhone(e164: string): string {
  if (!isE164(e164)) return "****";
  const keepTail = 4;
  const head = e164.slice(0, Math.max(1, e164.length - keepTail - 4));
  const tail = e164.slice(-keepTail);
  return `${head}****${tail}`;
}
