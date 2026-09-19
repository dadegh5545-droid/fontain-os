# scripts/

سكربتات التشغيل والاختبار بفلسفة Stars: `check-backend.mjs`، `seed-*.mjs`، `test-*.mjs`، `logs.mjs`.
تعمل على sandbox المطور، ومخرجاتها تُلصق في الـPR. المالك: Dev A.

## الموجود

- `test-auth-flow.mjs` (FOS-005): تدفّق الدخول بالهاتف وOTP على الخلفية المنشورة فعلًا، بلا محاكاة.
  ينشئ مستخدم اختبار، يقرأ الرمز من CloudWatch (وضع التسليم `log`)، يتحقق من القبول والرفض
  وسقف المحاولات واستهلاك الرمز مرة واحدة وعدم كشف وجود الرقم، ثم يحذف المستخدم دائمًا.

  ```powershell
  $env:AWS_REGION='ap-south-1'; $env:AWS_DEFAULT_REGION='ap-south-1'
  node scripts/test-auth-flow.mjs --profile lis
  ```

  الخيارات: `--profile`، `--region`، `--phone`. يحتاج `amplify_outputs.json` من sandbox منشور،
  وصلاحية قراءة CloudWatch وإدارة مستخدمي Cognito.
