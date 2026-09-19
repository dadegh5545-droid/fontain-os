# amplify/

خلفية Amplify Gen 2 (D-21). الحالي:

- `backend.ts`: `defineBackend({ auth, data, storage, … })` + جدول تحديات الـOTP.
- `auth/` (FOS-005): دخول بالهاتف وOTP (D-22) بتدفّق Cognito المخصّص، والمحفزات الأربعة
  `define-auth-challenge/`، `create-auth-challenge/`، `verify-auth-challenge-response/`، `pre-sign-up/`.
- `data/resource.ts` (FOS-004): Organization + UserProfile بصلاحيات apiKey **مؤقتة** حتى FOS-006.
- `storage/resource.ts`: هيكل فارغ حتى كيان Attachment.
- `shared/otp/`: منطق الـOTP (`code.ts`، `challenge-policy.ts`، `issue-policy.ts`، `store.ts`، `sender.ts`، `config.ts`).

لاحقًا: المجموعات وسمة `custom:organizationId` وseed (FOS-006)، `functions/` (leads/ work/ sales/ finance/ decisions/)، `shared/` (appsync.ts، activity.ts).
النشر: `npx ampx sandbox --identifier <dev-x>`، و`amplify_outputs.json` لا يُرفع أبدًا. المالك: Dev A.

## الـOTP: الضمانات وحدودها

رمز 6 خانات عشوائي معماريًا، صلاحية 5 دقائق، 3 محاولات للرمز نفسه، وحد 5 رموز لكل مستخدم في الساعة.
الجدول يحمل **هاش** الرمز وملحه فقط (لا الرمز)، بمفتاح `sub` المستخدم، وTTL يحذف السجلات.
المقارنة ثابتة الزمن، والرمز يُستهلك مرة واحدة. رقم غير مسجّل يسلك نفس المسار تمامًا فلا يُستدل على وجوده.

لماذا محفزات مخصّصة لا `phone: { otpLogin: true }` الأصلي: المواصفة تتطلب تحكّمًا كاملًا في الصلاحية
وسقف المحاولات وحد الإرسال وقناة التسليم، وهو ما لا يوفّره الوضع الأصلي المرتبط بقناة SMS الخاصة بـCognito.
و`accountRecovery: "NONE"` يمنع فتح تلك القناة في أي مسار، فلا رسائل من Cognito أصلًا
(`pre-sign-up` يؤكّد المستخدم ويعتمد رقمه).

### قناة التسليم — ما ينقص للإنتاج

`OTP_DELIVERY_MODE` مصرَّح به على دالة `create-auth-challenge`:

- `log` (الحالي، sandbox): الرمز يُكتب في CloudWatch ولا يُرسل SMS. قراءته تتطلب صلاحية AWS على
  السجلات، فليس بابًا خلفيًا يصل إليه العميل.
- `sms` (الإنتاج): **مزوّد الرسائل غير موصَّل بعد.** الوضع يفشل بصوت عالٍ ولا يسقط صامتًا إلى `log`،
  حتى لا يُنشر إنتاج يطبع رموزه في السجلات. وصل المزوّد (Twilio/SNS بمفتاح من `secret()`) شرط لـFOS-010.

التحقق: `node scripts/test-auth-flow.mjs --profile <p>` على sandbox منشور.

## ملاحظات أدوات

- `@aws-cdk/toolkit-lib` مثبّتة على `1.19.0` بالضبط في `package.json` لأن `@aws-amplify/data-construct@1.17.7`
  تُضمّن داخلها `plugin-types@1.12.1` التي تتطلب هذا الإصدار تحديدًا، وبدونه يرفض `npm ci` مزامنة الـlockfile.
  تُزال عند إصلاح الحزمة upstream.
- جدول `OtpChallenges` بسعة `PROVISIONED` 1/1 ليبقى داخل الطبقة المجانية لـDynamoDB؛ تُراجع في FOS-010.
