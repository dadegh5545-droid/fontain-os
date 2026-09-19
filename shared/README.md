# shared/

العقد المحايد بين الطرفين: `enums.ts` (القيم والأنواع)، `enum-labels.ts` (ترجمة ar/en لكل قيمة)، ثم `contracts/` و`validators/` لاحقًا، ويُستورد من الواجهة والخلفية معًا عبر `@shared/*`.
الـEnums مطابقة لـ`docs/data-schema.md` القسم 3، وتغييرها إضافي فقط (D-32). الاختبارات في `tests/shared/`. المالك: Dev A.

ملاحظة أدوات: `package.json` هنا يحتوي `"type": "module"` فقط. جذر المستودع CommonJS بينما `amplify/` وحدات ESM، فبدون هذا الحد تُحمَّل ملفات `shared/` كـCommonJS ويفشل synth الخلفية بـ`does not provide an export named 'ROLES'`.
