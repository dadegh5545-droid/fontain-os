# amplify/

خلفية Amplify Gen 2 (D-21). الحالي (FOS-004): `backend.ts`، `data/resource.ts` (Organization + UserProfile بصلاحيات apiKey **مؤقتة** حتى FOS-005/006)، `storage/resource.ts` (هيكل فارغ).
لاحقًا: `auth/` (FOS-005)، `functions/` (leads/ work/ sales/ finance/ decisions/)، `shared/` (appsync.ts، activity.ts، otp/). النشر: `npx ampx sandbox --identifier <dev-x>`، و`amplify_outputs.json` لا يُرفع أبدًا. المالك: Dev A.

ملاحظة أدوات: `@aws-cdk/toolkit-lib` مثبّتة على `1.19.0` بالضبط في `package.json` لأن `@aws-amplify/data-construct@1.17.7` تُضمّن داخلها `plugin-types@1.12.1` التي تتطلب هذا الإصدار تحديدًا، وبدونه يرفض `npm ci` مزامنة الـlockfile. تُزال عند إصلاح الحزمة upstream.
