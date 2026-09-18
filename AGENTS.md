# AGENTS.md — قواعد Claude Code والمطورين

هذا الملف يُقرأ في بداية كل جلسة Claude Code وكل مهمة مطوّر. المرجع: [`docs/DECISIONS.md`](./docs/DECISIONS.md) و[`docs/implementation-plan.md`](./docs/implementation-plan.md).

<!-- prettier-ignore-start -->

## DECISION REQUIRED
أثناء أي مهمة، إذا احتجت إلى: تغيير معماري، Model جديد غير موجود في المواصفة،
مكتبة أو اعتمادية رئيسية جديدة، تغيير قرار في docs/DECISIONS.md، أو توسيع نطاق المهمة،
فتوقف فورًا ولا تنفذ. اطبع:

DECISION REQUIRED
السبب: ...
الخيارات: 1) ... 2) ... 3) ...
توصيتي: ...

ثم انتظر اعتماد إنسان. لا تكمل المهمة بافتراض الخيار الأرجح.

<!-- prettier-ignore-end -->

## قواعد المهمة والفرع

- **One Task → One Branch → One PR.** الاستثناء الوحيد: `FOS-000 Repository Bootstrap` (D-51).
- تسمية الفرع: `feature/FOS-<id>-<slug>` (D-54). كل جلسة تبدأ من فرع جديد من `main` محدّث، وتنتهي بـPR واحد.
- رسالة الـcommit تبدأ بمعرّف المهمة: `FOS-101: add Lead model and createLead mutation`.
- لا PR يتجاوز مهمته. لا تبدأ المهمة التالية في نفس الفرع.
- `main` محمي: لا دفع مباشر، Squash merge فقط، لا دمج ذاتي (D-50).

## ملكية المجلدات (Folder ownership)

| المالك | المجلدات                          |
| ------ | --------------------------------- |
| Dev A  | `amplify/`، `scripts/`، `shared/` |
| Dev B  | `app/`، `src/`                    |

- Claude Code مع Dev A: **لا تلمس `app/` و`src/`**.
- Claude Code مع Dev B: **لا تلمس `amplify/` و`shared/`**.
- `docs/` و`AGENTS.md` يعدّلهما شخص واحد لكل PR.
- `shared/` هو العقد بين الطرفين: توقيعات الـMutations في `shared/contracts/` تُكتب وتُدمج أولًا، ثم يعمل الطرفان بالتوازي.

## الأسرار والملفات المولَّدة

- **لا تكتب أي سر في Git أبدًا**: لا مفاتيح API، لا access keys، لا `.env*`.
- **لا ترفع `amplify_outputs.json` ولا `.amplify/`** (مولَّدان، وAmplify Hosting يولّدهما للإنتاج).
- مفتاح Claude API وغيره تقرأه الـLambda فقط من Amplify `secret()` / SSM (D-29). `NEXT_PUBLIC_*` لا يحمل سرًا أبدًا.
- لا access keys للإنتاج على أي جهاز (D-53).

## الـSchema

- **تغييرات الـschema إضافية فقط**: لا حذف ولا إعادة تسمية حقل في نفس الإصدار (D-32).
- كل model يحمل `organizationId` إجباريًا مع فهرس ثانوي.
- كل تغيير حالة مهم يمر عبر Custom Mutation (Lambda) تكتب التغيير + `ActivityLog` + `DecisionItem` في خطوة واحدة. لا تحديث مباشر للحالات من الواجهة (D-23).
- الـAI يكتب في `Suggestion` فقط ولا يعتمد أي `DecisionItem` (D-06).

## قاعدة AWSJSON (ملاحظة للأمام)

حقول `a.json()` في Amplify (مثل `Proposal.items`، `Proposal.paymentSchedule`، `ActivityLog.meta`) **تُكتب عبر `toJsonField()` وتُقرأ عبر `parseJsonArray()`** (قاعدة AWSJSON المنقولة من Stars). لا تُمرَّر كائنات JavaScript مباشرة ولا يُستدعى `JSON.parse` يدويًا في الواجهة. تُطبَّق من FOS-004 فصاعدًا.

## قبل كل PR

```bash
npm run typecheck && npm run lint && npm run format:check && npm run build
```

واملأ قالب الـPR كاملًا مع قائمة Definition of Done من [`CONTRIBUTING.md`](./CONTRIBUTING.md).
