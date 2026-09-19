/**
 * Fontain OS — مخزن تحديات الـOTP في DynamoDB (FOS-005).
 *
 * لماذا جدول ولا `privateChallengeParameters` وحدها: Cognito لا يُمرّر المعاملات
 * الخاصة إلا من `createAuthChallenge` إلى `verifyAuthChallengeResponse` في نفس
 * الخطوة، فلا يمكن بها إبقاء رمز واحد صالحًا عبر محاولات متعددة ولا حساب حد
 * الإرسال عبر الجلسات. الجدول يحمل الهاش فقط (لا الرمز) وله TTL يحذف السجلات.
 *
 * الجدول يُنشأ في `amplify/backend.ts` ويُمرَّر اسمه بـ`OTP_TABLE_NAME`.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { OTP_RECORD_RETENTION_SECONDS } from "./config";
import type { OtpChallengeRecord } from "./issue-policy";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

/** اسم الجدول من البيئة. يفشل بوضوح إن لم يُمرَّر بدل أن يكتب في جدول خاطئ. */
function tableName(): string {
  const name = process.env.OTP_TABLE_NAME;
  if (!name) {
    throw new Error("OTP_TABLE_NAME is not set on this function.");
  }
  return name;
}

/** يقرأ سجل التحدي الحالي للمستخدم، أو `undefined` إن لم يوجد. */
export async function getChallenge(userKey: string): Promise<OtpChallengeRecord | undefined> {
  const result = await client.send(
    new GetCommand({
      TableName: tableName(),
      Key: { userKey },
      ConsistentRead: true,
    }),
  );
  return result.Item as OtpChallengeRecord | undefined;
}

/** يكتب سجل التحدي (يستبدل أي سجل سابق لنفس المستخدم) ويضبط TTL. */
export async function putChallenge(
  record: Omit<OtpChallengeRecord, "ttl"> & { ttl?: number },
): Promise<void> {
  const item: OtpChallengeRecord = {
    ...record,
    ttl: record.ttl ?? record.windowStartedAt + OTP_RECORD_RETENTION_SECONDS,
  };
  await client.send(new PutCommand({ TableName: tableName(), Item: item }));
}

/** يزيد عدّاد المحاولات الخاطئة ويعيد قيمته الجديدة. */
export async function registerFailedAttempt(userKey: string): Promise<number> {
  const result = await client.send(
    new UpdateCommand({
      TableName: tableName(),
      Key: { userKey },
      UpdateExpression: "SET attempts = if_not_exists(attempts, :zero) + :one",
      ExpressionAttributeValues: { ":zero": 0, ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    }),
  );
  const attempts = result.Attributes?.attempts;
  return typeof attempts === "number" ? attempts : 0;
}

/** يحذف السجل: عند النجاح (رمز يُستخدم مرة واحدة) أو عند انتهاء الصلاحية. */
export async function deleteChallenge(userKey: string): Promise<void> {
  await client.send(new DeleteCommand({ TableName: tableName(), Key: { userKey } }));
}
