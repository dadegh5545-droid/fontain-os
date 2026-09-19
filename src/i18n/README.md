# src/i18n/

أساس الترجمة (FOS-002): `en.ts` هو المصدر، و`ar.ts` مُطبَّع عليه (`MessageTree`) فيفشل `typecheck` عند أي مفتاح ناقص أو زائد، واختبار `tests/src/i18n/` يؤكد ذلك في CI.
الاستخدام: `const t = useT(); t("nav.inbox")` داخل `LocaleProvider`؛ `getLocale()` في الخادم يقرأ cookie `fos_locale` ويضبط `lang`/`dir` على `<html>`؛ `LanguageSwitcher` يبدّل بلا إعادة تحميل. المالك: Dev B.
