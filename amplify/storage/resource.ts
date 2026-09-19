import { defineStorage } from "@aws-amplify/backend";

/**
 * مخزن S3 للمرفقات (`Attachment.s3Key`، Sprint 2). هيكل فارغ عمدًا في FOS-004:
 * لا مسارات ولا قواعد وصول حتى يوجد auth (FOS-005) وكيان Attachment.
 */
export const storage = defineStorage({
  name: "fontainOsStorage",
});
