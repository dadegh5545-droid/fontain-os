# Fontain OS

نظام التشغيل الداخلي لـ**Fontain Digital Solutions**: من الـLead الأول إلى العميل والمشروع والمهام والفواتير والتجديد، في مكان واحد. الاسم `Fontain OS` اسم تطوير وليس Branding نهائيًا (D-01). يُبنى لاستخدام Fontain أولًا، لا SaaS الآن (D-02).

المبدأ الحاكم: **AI suggests, Human approves** (D-06). كل ما يحتاج قرار إنسان يظهر في `Decision Inbox`، وكل خطوة تُكتب في `ActivityLog`.

## Stack

| الطبقة    | التقنية                                                              |
| --------- | -------------------------------------------------------------------- |
| الواجهة   | Next.js (App Router) + TypeScript (`strict`) + Tailwind CSS          |
| الخلفية   | AWS Amplify Gen 2: Cognito + AppSync + DynamoDB + S3 + Lambda (D-21) |
| الهوية    | دخول بالهاتف + OTP (D-22)                                            |
| اللغات    | عربي + إنجليزي، RTL/LTR من اليوم الأول (D-24)                        |
| الاستضافة | Amplify Hosting، المنطقة `ap-south-1` (D-26, D-27)                   |
| الجودة    | ESLint (`next/core-web-vitals` + `typescript`)، Prettier، GitHub CI  |

## التشغيل محليًا (Local)

المتطلبات: Node.js 20 أو أحدث، npm.

```bash
npm ci            # تثبيت الاعتماديات
npm run dev       # http://localhost:3000
```

فحوصات الجودة (نفسها التي يشغّلها CI):

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run format:check
npm run build
```

`npm run format` يصلح التنسيق تلقائيًا. لا `.env` مطلوب في هذه المرحلة؛ عند إضافة الخلفية (FOS-004) يُستخدم `ampx sandbox` ولا يُرفع `amplify_outputs.json` أبدًا.

## هيكل المستودع

```
app/          مسارات Next.js فقط (رفيعة)             ← Dev B
src/          features/ components/ lib/ i18n/         ← Dev B
amplify/      خلفية Amplify Gen 2                      ← Dev A
shared/       enums / contracts / validators (عقد مشترك) ← Dev A
scripts/      check-backend، seed، test-*              ← Dev A
tests/        vitest بنفس هيكل src/ و shared/
docs/         القرارات، Blueprint، Schema، الخطة، الـSprints
.github/      CI، قالب PR، CODEOWNERS
```

الـalias: `@/*` → `src/*` و`@shared/*` → `shared/*`. التفصيل في `docs/implementation-plan.md` (القسم 2).

## كيف تقرأ المستندات

ابدأ من [`docs/README.md`](./docs/README.md) ثم بالترتيب: `DECISIONS.md` → `blueprint.md` → `data-schema.md` → `implementation-plan.md` → `sprints/`. القرارات المرقّمة `D-xx` مرجعية في كل PR.

## المساهمة والقواعد

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Git Workflow وDefinition of Done.
- [`AGENTS.md`](./AGENTS.md) — قواعد Claude Code والمطورين، وقاعدة `DECISION REQUIRED`.

قاعدة واحدة تحكم كل شيء: **One Task → One Branch → One PR** (D-51)، والفرع يُسمّى `feature/FOS-<id>-<slug>`.
