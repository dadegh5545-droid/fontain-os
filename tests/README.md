# tests/

اختبارات الوحدة بـvitest، بنفس هيكل `src/` و`shared/` و`amplify/` (المنطق النقي فقط: الهاتف، الـOTP، متأخر، الانتقالات، ar/en).
التشغيل: `npm test` (يعمل في CI بعد lint).

- `tests/shared/`: مطابقة الـEnums واكتمال الترجمة (FOS-001)، وتطبيع الهاتف (FOS-005).
- `tests/src/`: i18n وتخطيط الـApp Shell (FOS-002/003).
- `tests/amplify/shared/otp/`: توليد الرمز والهاش والمقارنة، وقرار التحدي، وحد الإرسال (FOS-005).
  ما لا يُختبر هنا: مسار Cognito نفسه وDynamoDB — يغطيه `scripts/test-auth-flow.mjs` على sandbox حقيقي.
