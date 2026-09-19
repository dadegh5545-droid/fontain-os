import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

/**
 * Fontain OS — Amplify Gen 2 backend (FOS-004 skeleton).
 *
 * الموارد الحالية: `data` (Organization + UserProfile) و`storage` (هيكل فارغ).
 * تُضاف لاحقًا بالترتيب: `auth/` (FOS-005: هاتف + OTP)، المجموعات وسمة
 * `custom:organizationId` (FOS-006)، `functions/` بنمط Custom Mutation + ActivityLog (FOS-007).
 * المنطقة `ap-south-1` (D-26) تُضبط في sandbox/Console لا هنا.
 */
export const backend = defineBackend({
  data,
  storage,
});
