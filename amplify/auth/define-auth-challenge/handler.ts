/**
 * Fontain OS — محفّز `defineAuthChallenge` (FOS-005).
 *
 * المنطق كله في `decideAuthChallenge` (مُختبر بـvitest)، وهذا الملف ربط فقط.
 */

import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";
import { decideAuthChallenge } from "../../shared/otp/challenge-policy";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  const decision = decideAuthChallenge(event.request.session);

  event.response.issueTokens = decision.issueTokens;
  event.response.failAuthentication = decision.failAuthentication;
  if (decision.challengeName) {
    event.response.challengeName = decision.challengeName;
  }

  return event;
};
