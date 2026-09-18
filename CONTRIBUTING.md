# CONTRIBUTING — Fontain OS

هذا الملف يحدد كيف يدخل أي تغيير إلى `main`. المرجع الكامل في [`docs/implementation-plan.md`](./docs/implementation-plan.md) (القسمان 6 و7)، وقواعد Claude Code في [`AGENTS.md`](./AGENTS.md).

## القواعد الثابتة

- `main` محمي: PR إجباري + مراجع واحد + CI أخضر. لا دفع مباشر. Squash merge فقط (D-50).
- **One Task → One Branch → One PR.** الاستثناء الوحيد: `FOS-000 Repository Bootstrap` (D-51).
- تسمية الفرع: `feature/FOS-<id>-<slug>` (D-54).
- الملكية: Dev A يملك `amplify/`، `scripts/`، `shared/`. Dev B يملك `app/`، `src/`. `docs/` و`AGENTS.md` يعدّلهما شخص واحد لكل PR.
- لا سر ولا ملف مولَّد في Git: `.env*`، `amplify_outputs.json`، `.amplify/`.
- تغييرات الـschema إضافية فقط: لا حذف ولا إعادة تسمية حقل في نفس الإصدار (D-32).

## Git Workflow (مثال FOS-101 Create Lead)

1. المهمة في `docs/sprints/sprint-1.md` ببند قبول.
2. `git checkout main && git pull && git checkout -b feature/FOS-101-create-lead`
3. Claude Code: "نفّذ FOS-101 حسب المواصفة… لا تلمس app/ و src/."
4. المطور يقرأ الفرق كاملًا، يشغّل sandbox والسكربت، يصلح.
5. `git commit -m "FOS-101: add Lead model and createLead mutation"` ثم push.
6. PR بقالب المستودع. CI تلقائيًا.
7. المطور الآخر (أو Owner) يراجع.
8. CI أخضر + موافقة → Squash merge، حذف الفرع.
9. Amplify ينشر main؛ `check-backend.mjs` على الإنتاج؛ المهمة "منشور".

قواعد: فرع لكل مهمة، PR لكل فرع، لا PR يتجاوز مهمة، لا دمج ذاتي.

## Definition of Done

1. بند القبول يعمل على sandbox.
2. عربي RTL وإنجليزي LTR بلا نقص.
3. 400px بلا تمرير أفقي.
4. ActivityLog وDecisionItem حيث تنص المواصفة.
5. الصلاحيات في الخادم واختُبر الرفض.
6. لا سر ولا ملف مولَّد.
7. CI أخضر.
8. سكربت تكامل موجود ونجح ومخرجاته في الـPR.
9. مراجع وافق، دُمج بـsquash.
10. المواصفة/DECISIONS محدّثة إن لزم.

## قبل فتح الـPR

```bash
npm run typecheck && npm run lint && npm run format:check && npm run build
```

ثم املأ قالب الـPR كاملًا: `Task ID`، `What changed`، `How it was tested` (مخرجات السكربت)، `Screenshots (AR + EN)`، وقائمة Definition of Done أعلاه.
